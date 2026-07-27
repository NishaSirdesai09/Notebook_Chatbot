import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v5 as uuidv5 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { DocType } from '../../common/types';
import { EmbeddingService } from '../embedding/embedding.service';
import { QdrantService, ChunkPayload } from '../qdrant/qdrant.service';
import { SettingsService } from '../settings/settings.service';
import { FILE_STORAGE, FileStorage } from '../storage/storage.interface';
import { PdfExtractService, PageText } from './pdf-extract.service';

const QDRANT_POINT_NS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const CHUNK_SIZE = Number(process.env.RAG_CHUNK_SIZE ?? 900);
const CHUNK_OVERLAP = Number(process.env.RAG_CHUNK_OVERLAP ?? 120);

type ProgressUpdate = {
  progress: number;
  stage: string;
  status?: string;
};

@Injectable()
export class IngestionProcessor {
  private readonly logger = new Logger(IngestionProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly embedding: EmbeddingService,
    private readonly qdrant: QdrantService,
    private readonly settings: SettingsService,
    private readonly pdf: PdfExtractService,
    @Inject(FILE_STORAGE) private readonly storage: FileStorage,
    private readonly env: ConfigService,
  ) {}

  async process(documentId: string, jobId: string): Promise<void> {
    const job = await this.prisma.ingestionJob.findUnique({ where: { id: jobId } });
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { notebook: { select: { ownerId: true } } },
    });

    if (!job || !doc) throw new Error('Document or job not found');

    const storageKey = doc.storageKey ?? doc.storagePath;
    if (!storageKey) throw new Error('No storage key for document');

    try {
      await this.prisma.ingestionJob.update({
        where: { id: jobId },
        data: {
          status: job.attemptCount > 0 ? 'RETRYING' : 'ACTIVE',
          attemptCount: { increment: 1 },
          startedAt: new Date(),
          errorMessage: null,
        },
      });

      // Idempotent retry — remove prior vectors and chunk records
      await this.qdrant.deleteByDocument(documentId);
      await this.prisma.documentChunk.deleteMany({ where: { documentId } });

      await this.updateDoc(documentId, { progress: 15, stage: 'Reading document', status: 'extracting' });

      const buffer = await this.storage.getFile(doc.storageKey ?? storageKey);

      await this.updateDoc(documentId, { progress: 30, stage: 'Extracting text', status: 'extracting' });
      const pages = await this.pdf.extractPages(buffer, doc.type as DocType);

      await this.prisma.document.update({
        where: { id: documentId },
        data: { pages: pages.length },
      });

      await this.updateDoc(documentId, { progress: 50, stage: 'Splitting into chunks', status: 'chunking' });
      const chunks = this.chunkPages(pages, {
        notebookId: doc.notebookId,
        userId: doc.notebook.ownerId,
        documentId: doc.id,
        documentName: doc.name,
        docType: doc.type,
      });

      if (chunks.length === 0) {
        throw new Error('No text chunks could be created from this document');
      }

      await this.updateDoc(documentId, { progress: 70, stage: 'Creating embeddings', status: 'embedding' });
      const embedKey = this.settings.resolveEmbeddingApiKey();
      const batchSize = 16;

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const vectors = await this.embedding.embed(
          batch.map((c) => c.payload.content),
          embedKey,
        );

        const pct = 70 + Math.floor(((i + batch.length) / chunks.length) * 20);
        await this.updateDoc(documentId, {
          progress: pct,
          stage: 'Indexing vectors',
          status: 'indexing',
        });

        await this.qdrant.upsertChunks(
          batch.map((chunk, idx) => ({
            pointId: chunk.pointId,
            vector: vectors[idx],
            payload: chunk.payload,
          })),
        );

        await this.prisma.documentChunk.createMany({
          data: batch.map((chunk) => ({
            documentId,
            chunkIndex: chunk.payload.chunkIndex,
            pageNumber: chunk.payload.page,
            qdrantPointId: chunk.pointId,
            tokenCount: Math.ceil(chunk.payload.content.length / 4),
          })),
        });
      }

      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          status: 'ready',
          processingProgress: 100,
          processingStage: 'Ready',
          indexedAt: new Date(),
          errorMessage: null,
        },
      });

      await this.prisma.ingestionJob.update({
        where: { id: jobId },
        data: { status: 'COMPLETED', progress: 100, completedAt: new Date() },
      });

      await this.prisma.notebook.update({
        where: { id: doc.notebookId },
        data: { status: 'Ready', files: { increment: 1 } },
      });

      this.logger.log(`Indexed ${chunks.length} chunks for "${doc.name}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ingestion failed';
      this.logger.error(`Ingestion failed for ${documentId}: ${message}`);

      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: 'failed', errorMessage: message, processingStage: 'Failed' },
      });

      await this.prisma.ingestionJob.update({
        where: { id: jobId },
        data: { status: 'FAILED', errorMessage: message, failedAt: new Date() },
      });

      throw err;
    }
  }

  private async updateDoc(documentId: string, u: ProgressUpdate) {
    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        processingProgress: u.progress,
        processingStage: u.stage,
        ...(u.status ? { status: u.status } : {}),
      },
    });
    await this.prisma.ingestionJob.updateMany({
      where: { documentId, status: { in: ['ACTIVE', 'RETRYING', 'PENDING'] } },
      data: { progress: u.progress },
    });
  }

  private chunkPages(
    pages: PageText[],
    meta: {
      notebookId: string;
      userId: string;
      documentId: string;
      documentName: string;
      docType: string;
    },
  ) {
    const output: { pointId: string; payload: ChunkPayload }[] = [];
    let chunkIndex = 0;

    for (const page of pages) {
      let start = 0;
      while (start < page.text.length) {
        const end = Math.min(start + CHUNK_SIZE, page.text.length);
        const content = page.text.slice(start, end).trim();
        if (content.length > 40) {
          output.push({
            pointId: uuidv5(`${meta.documentId}:${chunkIndex}`, QDRANT_POINT_NS),
            payload: {
              userId: meta.userId,
              notebookId: meta.notebookId,
              documentId: meta.documentId,
              documentName: meta.documentName,
              docType: meta.docType,
              page: page.page,
              chunkIndex: chunkIndex++,
              content,
            },
          });
        }
        if (end >= page.text.length) break;
        start = end - CHUNK_OVERLAP;
      }
    }

    return output;
  }
}
