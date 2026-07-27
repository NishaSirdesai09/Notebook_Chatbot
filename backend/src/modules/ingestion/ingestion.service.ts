import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IngestionQueueService } from './ingestion-queue.service';

@Injectable()
export class IngestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: IngestionQueueService,
  ) {}

  async scheduleIngestion(documentId: string) {
    const job = await this.prisma.ingestionJob.create({
      data: { documentId, status: 'PENDING', progress: 5 },
    });

    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'queued',
        processingProgress: 5,
        processingStage: 'Queued for processing',
      },
    });

    await this.queue.enqueue(documentId, job.id);
    return job;
  }

  async retryIngestion(documentId: string) {
    const existing = await this.prisma.ingestionJob.findFirst({
      where: { documentId, status: { in: ['FAILED', 'COMPLETED'] } },
      orderBy: { createdAt: 'desc' },
    });

    if (existing?.status === 'COMPLETED') {
      return existing;
    }

    return this.scheduleIngestion(documentId);
  }
}
