import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { DocStatus, DocumentEntity, DocType } from '../../common/types';
import { AuthorizationService } from '../auth/authorization.service';
import { IngestionService } from '../ingestion/ingestion.service';
import { QdrantService } from '../qdrant/qdrant.service';
import { FILE_STORAGE, FileStorage } from '../storage/storage.interface';

const PIPELINE: DocStatus[] = [
  'queued',
  'extracting',
  'chunking',
  'embedding',
  'indexing',
  'ready',
];

const ALLOWED_MIME: Record<string, DocType> = {
  'application/pdf': 'pdf',
  'text/plain': 'txt',
};

const MAX_BYTES = 25 * 1024 * 1024;

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingestion: IngestionService,
    private readonly qdrant: QdrantService,
    private readonly authz: AuthorizationService,
    @Inject(FILE_STORAGE) private readonly storage: FileStorage,
    private readonly env: ConfigService,
  ) {}

  async upload(
    file: Express.Multer.File,
    notebookId: string,
    userId: string,
    explicitType?: string,
  ): Promise<DocumentEntity> {
    if (!file) throw new BadRequestException('File is required');
    if (!notebookId) throw new BadRequestException('notebookId is required');
    if (file.size > MAX_BYTES) throw new BadRequestException('File exceeds 25 MB limit');

    await this.authz.assertNotebookOwner(notebookId, userId);

    const type = this.resolveType(file, explicitType);
    const docId = randomUUID();
    const ext = extname(file.originalname) || (type === 'pdf' ? '.pdf' : '.txt');
    const storageKey = `${notebookId}/${docId}${ext}`;

    await this.storage.saveFile({
      key: storageKey,
      buffer: file.buffer,
      mimeType: file.mimetype,
      originalName: file.originalname,
    });

    const doc = await this.prisma.document.create({
      data: {
        id: docId,
        name: file.originalname,
        type,
        mimeType: file.mimetype,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        sizeBytes: file.size,
        notebookId,
        uploadedByUserId: userId,
        status: 'queued',
        processingProgress: 5,
        processingStage: 'File stored',
        storageKey,
      },
    });

    await this.ingestion.scheduleIngestion(doc.id);
    return this.toEntity(doc);
  }

  async listByNotebook(notebookId: string, userId: string): Promise<DocumentEntity[]> {
    await this.authz.assertNotebookOwner(notebookId, userId);
    const docs = await this.prisma.document.findMany({
      where: { notebookId },
      orderBy: { uploadedAt: 'desc' },
    });
    return docs.map((d) => this.toEntity(d));
  }

  async status(id: string, userId: string) {
    await this.authz.assertDocumentAccess(id, userId);
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);

    return {
      id,
      status: doc.status as DocStatus,
      progress: doc.processingProgress,
      stage: doc.processingStage ?? undefined,
      stages: PIPELINE,
      errorMessage: doc.errorMessage ?? undefined,
    };
  }

  async retry(id: string, userId: string) {
    const doc = await this.authz.assertDocumentAccess(id, userId);
    if (doc.status !== 'failed') {
      throw new BadRequestException('Only failed documents can be retried');
    }

    await this.prisma.document.update({
      where: { id },
      data: { status: 'queued', errorMessage: null, processingProgress: 5 },
    });

    await this.ingestion.retryIngestion(id);
    return { success: true };
  }

  async remove(id: string, userId: string) {
    const doc = await this.authz.assertDocumentAccess(id, userId);

    await this.qdrant.deleteByDocument(id);
    await this.prisma.documentChunk.deleteMany({ where: { documentId: id } });

    const key = doc.storageKey ?? doc.storagePath;
    if (key) {
      try {
        await this.storage.deleteFile(key);
      } catch {
        // file may already be missing
      }
    }

    await this.prisma.document.delete({ where: { id } });
    return { success: true };
  }

  private resolveType(file: Express.Multer.File, explicit?: string): DocType {
    const fromMime = ALLOWED_MIME[file.mimetype];
    if (fromMime) {
      if (/prof[_\s]|professor|reference|hbr_|syllabus_ref/i.test(file.originalname)) {
        return 'reference';
      }
      return fromMime;
    }

    if (explicit) return explicit as DocType;

    const n = file.originalname.toLowerCase();
    if (n.endsWith('.pdf')) return 'pdf';
    if (n.endsWith('.txt')) return 'txt';

    throw new BadRequestException('Unsupported file type. Upload PDF or TXT only.');
  }

  private toEntity(doc: {
    id: string;
    name: string;
    type: string;
    size: string;
    notebookId: string;
    status: string;
    pages: number | null;
    processingProgress: number;
    processingStage: string | null;
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
      processingProgress: doc.processingProgress,
      processingStage: doc.processingStage ?? undefined,
      uploadedAt: doc.uploadedAt.toISOString(),
    };
  }
}
