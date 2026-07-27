import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { IngestionProcessor } from './ingestion.processor';

export const INGESTION_QUEUE = 'document-ingestion';

export type IngestionJobData = {
  documentId: string;
  jobId: string;
};

@Injectable()
export class IngestionQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IngestionQueueService.name);
  private queue!: Queue<IngestionJobData>;
  private worker!: Worker<IngestionJobData>;
  private connection!: IORedis;

  constructor(
    private readonly env: ConfigService,
    private readonly processor: IngestionProcessor,
  ) {}

  onModuleInit() {
    const redisUrl = this.env.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
    this.connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

    this.queue = new Queue<IngestionJobData>(INGESTION_QUEUE, {
      connection: this.connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });

    this.worker = new Worker<IngestionJobData>(
      INGESTION_QUEUE,
      async (job) => this.processor.process(job.data.documentId, job.data.jobId),
      { connection: this.connection, concurrency: 2 },
    );

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed: ${err.message}`);
    });

    this.logger.log('Ingestion queue worker started');
  }

  async onModuleDestroy() {
    await this.worker?.close();
    await this.queue?.close();
    this.connection?.disconnect();
  }

  async enqueue(documentId: string, jobId: string) {
    await this.queue.add(
      'ingest',
      { documentId, jobId },
      { jobId: `ingest-${documentId}-${jobId}` },
    );
  }
}
