import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DocStatus, DocumentEntity, DocType } from '../../common/types';
import { seedDocuments } from '../../common/seed';
import { UploadDocumentDto } from './dto/document.dto';

/**
 * Processing pipeline stages a document moves through after upload:
 * queued → extracting → chunking → embedding → indexing → ready
 *
 * In production: store the file in S3, then enqueue a job that runs text
 * extraction, chunking, embedding (vector DB), and indexing.
 */
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
  private documents: DocumentEntity[] = [...seedDocuments];

  upload(dto: UploadDocumentDto): DocumentEntity {
    const doc: DocumentEntity = {
      id: `d_${randomUUID()}`,
      name: dto.name,
      type: this.inferType(dto.name, dto.type),
      size: '—',
      notebookId: dto.notebookId,
      status: 'queued',
      uploadedAt: new Date().toISOString(),
    };
    this.documents = [doc, ...this.documents];
    return doc;
  }

  /**
   * Returns the current processing status. Here we advance the stage on each
   * poll to simulate progress; a real implementation would read job state.
   */
  status(id: string): { id: string; status: DocStatus; stages: DocStatus[] } {
    const doc = this.documents.find((d) => d.id === id);
    if (!doc) {
      return { id, status: 'ready', stages: PIPELINE };
    }
    const currentIndex = PIPELINE.indexOf(doc.status);
    const nextIndex = Math.min(currentIndex + 1, PIPELINE.length - 1);
    doc.status = PIPELINE[nextIndex];
    return { id, status: doc.status, stages: PIPELINE };
  }

  private inferType(name: string, explicit?: string): DocType {
    if (explicit) return explicit as DocType;
    const n = name.toLowerCase();
    if (n.endsWith('.pdf')) return 'pdf';
    if (n.endsWith('.doc') || n.endsWith('.docx')) return 'docx';
    if (n.endsWith('.ppt') || n.endsWith('.pptx')) return 'ppt';
    if (n.endsWith('.txt')) return 'txt';
    if (/\.(png|jpe?g|gif|webp)$/.test(n)) return 'image';
    if (n.includes('youtube')) return 'youtube';
    if (n.startsWith('http')) return 'link';
    return 'txt';
  }
}
