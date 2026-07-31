import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { IngestionService } from './ingestion.service';

@Module({
  imports: [SettingsModule],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
