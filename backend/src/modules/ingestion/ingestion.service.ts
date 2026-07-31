import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { PrismaService } from '../../prisma/prisma.service';
import { DocStatus, DocType } from '../../common/types';
import { EmbeddingService } from '../embedding/embedding.service';
import { LlmConfigService } from '../llm/llm-config.service';
import { QdrantService } from '../qdrant/qdrant.service';
import { SettingsService } from '../settings/settings.service';

const CHUNK_SIZE = 900;
const CHUNK_OVERLAP = 120;

type PageText = { page: number; text: string };

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly embedding: EmbeddingService,
    private readonly qdrant: QdrantService,
    private readonly settings: SettingsService,
    private readonly llmConfig: LlmConfigService,
  ) {}

  async ingestDocument(documentId: string): Promise<void> {
    const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!doc?.storagePath) {
      throw new Error(`Document ${documentId} has no storage path`);
    }

    try {
      await this.setStatus(documentId, 'extracting');
      const pages = await this.extractText(doc.storagePath, doc.type as DocType);
      await this.prisma.document.update({
        where: { id: documentId },
        data: { pages: pages.length || undefined },
      });

      await this.setStatus(documentId, 'chunking');
      const chunks = this.chunkPages(pages, {
        notebookId: doc.notebookId,
        documentId: doc.id,
        documentName: doc.name,
        docType: doc.type,
      });

      if (chunks.length === 0) {
        throw new Error('No text could be extracted from this file');
      }

      await this.setStatus(documentId, 'embedding');
      const embeddingProvider = this.llmConfig.getEmbeddingConfig().providerId;
      const embedKey = await this.settings.resolveApiKeyForNotebook(doc.notebookId, embeddingProvider);
      const batchSize = 16;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const vectors = await this.embedding.embed(
          batch.map((c) => c.payload.content),
          embedKey,
        );
        await this.setStatus(documentId, i + batchSize >= chunks.length ? 'indexing' : 'embedding');
        await this.qdrant.upsertChunks(
          batch.map((chunk, idx) => ({ vector: vectors[idx], payload: chunk.payload })),
        );
      }

      await this.setStatus(documentId, 'ready');
      await this.prisma.notebook.update({
        where: { id: doc.notebookId },
        data: { status: 'Ready', files: { increment: 1 } },
      });
      this.logger.log(`Indexed ${chunks.length} chunks for document ${doc.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ingestion failed';
      this.logger.error(`Ingestion failed for ${documentId}: ${message}`);
      await this.prisma.document.update({
        where: { id: documentId },
        data: { status: 'failed', errorMessage: message },
      });
      throw err;
    }
  }

  private async setStatus(documentId: string, status: DocStatus) {
    await this.prisma.document.update({ where: { id: documentId }, data: { status } });
  }

  private async extractText(storagePath: string, type: DocType): Promise<PageText[]> {
    if (type === 'txt') {
      const text = readFileSync(storagePath, 'utf-8');
      return [{ page: 1, text }];
    }

    if (type === 'pdf' || type === 'reference') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse') as (
        buffer: Buffer,
      ) => Promise<{ text: string; numpages: number }>;
      const buffer = readFileSync(storagePath);
      const parsed = await pdfParse(buffer);
      if (parsed.numpages <= 1) {
        return [{ page: 1, text: parsed.text }];
      }
      // pdf-parse returns combined text; split roughly by page count
      const perPage = Math.ceil(parsed.text.length / parsed.numpages);
      const pages: PageText[] = [];
      for (let p = 0; p < parsed.numpages; p++) {
        pages.push({
          page: p + 1,
          text: parsed.text.slice(p * perPage, (p + 1) * perPage),
        });
      }
      return pages.filter((pg) => pg.text.trim().length > 0);
    }

    throw new Error(`Unsupported file type for ingestion: ${type}`);
  }

  private chunkPages(
    pages: PageText[],
    meta: { notebookId: string; documentId: string; documentName: string; docType: string },
  ) {
    const output: { payload: import('../qdrant/qdrant.service').ChunkPayload }[] = [];
    let chunkIndex = 0;

    for (const page of pages) {
      const normalized = page.text.replace(/\s+/g, ' ').trim();
      if (!normalized) continue;

      let start = 0;
      while (start < normalized.length) {
        const end = Math.min(start + CHUNK_SIZE, normalized.length);
        const content = normalized.slice(start, end).trim();
        if (content.length > 40) {
          output.push({
            payload: {
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
        if (end >= normalized.length) break;
        start = end - CHUNK_OVERLAP;
      }
    }

    return output;
  }
}
