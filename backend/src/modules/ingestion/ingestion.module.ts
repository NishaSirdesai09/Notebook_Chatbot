import { Module } from '@nestjs/common';
import { EmbeddingModule } from '../embedding/embedding.module';
import { QdrantModule } from '../qdrant/qdrant.module';
import { SettingsModule } from '../settings/settings.module';
import { StorageModule } from '../storage/storage.module';
import { IngestionProcessor } from './ingestion.processor';
import { IngestionQueueService } from './ingestion-queue.service';
import { IngestionService } from './ingestion.service';
import { PdfExtractService } from './pdf-extract.service';

@Module({
  imports: [SettingsModule, StorageModule, EmbeddingModule, QdrantModule],
  providers: [
    IngestionService,
    IngestionProcessor,
    IngestionQueueService,
    PdfExtractService,
  ],
  exports: [IngestionService],
})
export class IngestionModule {}
