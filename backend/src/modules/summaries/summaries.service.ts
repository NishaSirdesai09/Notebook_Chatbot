import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Summary } from '../../common/types';
import { seedSummary } from '../../common/seed';
import { GenerateSummaryDto } from './dto/summary.dto';

@Injectable()
export class SummariesService {
  /**
   * Generate a summary of the requested type from the notebook's material.
   * Production: retrieve relevant chunks and run an LLM summarization chain.
   */
  generate(dto: GenerateSummaryDto): Summary {
    return {
      ...seedSummary,
      id: `s_${randomUUID()}`,
      type: dto.type,
      createdAt: new Date().toISOString(),
    };
  }
}
