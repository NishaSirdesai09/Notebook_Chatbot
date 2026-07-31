import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { mkdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { DocStatus, DocumentEntity, DocType } from '../../common/types';
import { IngestionService } from '../ingestion/ingestion.service';
import { QdrantService } from '../qdrant/qdrant.service';

const PIPELINE: DocStatus[] = [
  'queued',
  'extracting',
  'chunking',
  'embedding',
  'indexing',
  'ready',
];

@Injectable()
export class DocumentsService {
  private readonly uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestion: IngestionService,
    private readonly qdrant: QdrantService,
    env: ConfigService,
  ) {
    this.uploadDir = env.get<string>('UPLOAD_DIR') ?? join(process.cwd(), 'uploads');
    mkdirSync(this.uploadDir, { recursive: true });
  }

  async upload(
    file: Express.Multer.File,
    notebookId: string,
    explicitType?: string,
  ): Promise<DocumentEntity> {
    const notebook = await this.prisma.notebook.findUnique({ where: { id: notebookId } });
    if (!notebook) throw new NotFoundException(`Notebook ${notebookId} not found`);

    const docId = randomUUID();
    const notebookDir = join(this.uploadDir, notebookId);
    mkdirSync(notebookDir, { recursive: true });
    const storagePath = join(notebookDir, `${docId}${extname(file.originalname)}`);
    writeFileSync(storagePath, file.buffer);

    const type = this.inferType(file.originalname, explicitType);
    const doc = await this.prisma.document.create({
      data: {
        id: docId,
        name: file.originalname,
        type,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        notebookId,
        status: 'queued',
        storagePath,
      },
    });

    void this.runIngestion(doc.id);
    return this.toEntity(doc);
  }

  async listByNotebook(notebookId: string): Promise<DocumentEntity[]> {
    const docs = await this.prisma.document.findMany({
      where: { notebookId },
      orderBy: { uploadedAt: 'desc' },
    });
    return docs.map((d) => this.toEntity(d));
  }

  async status(id: string): Promise<{ id: string; status: DocStatus; stages: DocStatus[]; errorMessage?: string }> {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);
    return {
      id,
      status: doc.status as DocStatus,
      stages: PIPELINE,
      errorMessage: doc.errorMessage ?? undefined,
    };
  }

  async remove(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);
    await this.qdrant.deleteByDocument(id);
    await this.prisma.document.delete({ where: { id } });
    return { success: true };
  }

  private async runIngestion(documentId: string) {
    try {
      await this.ingestion.ingestDocument(documentId);
    } catch {
      // status/error already persisted by ingestion service
    }
  }

  private inferType(name: string, explicit?: string): DocType {
    if (explicit) return explicit as DocType;
    const n = name.toLowerCase();
    if (/prof[_\s]|professor|reference|hbr_|syllabus_ref/.test(n)) return 'reference';
    if (n.endsWith('.pdf')) return 'pdf';
    if (n.endsWith('.doc') || n.endsWith('.docx')) return 'docx';
    if (n.endsWith('.ppt') || n.endsWith('.pptx')) return 'ppt';
    if (n.endsWith('.txt')) return 'txt';
    if (/\.(png|jpe?g|gif|webp)$/.test(n)) return 'image';
    if (n.includes('youtube')) return 'youtube';
    if (n.startsWith('http')) return 'link';
    return 'txt';
  }

  private toEntity(doc: {
    id: string;
    name: string;
    type: string;
    size: string;
    notebookId: string;
    status: string;
    pages: number | null;
    uploadedAt: Date;
  }): DocumentEntity {
    return {
      id: doc.id,
      name: doc.name,
      type: doc.type as DocType,
      size: doc.size,
      notebookId: doc.notebookId,
      status: doc.status as DocStatus,
      pages: doc.pages ?? undefined,
      uploadedAt: doc.uploadedAt.toISOString(),
    };
  }
}
