import { Injectable, NotImplementedException } from '@nestjs/common';
import { Summary } from '../../common/types';

@Injectable()
export class SummariesService {
  generate(_input: { notebookId: string; type: string }): Summary {
    throw new NotImplementedException('Summaries will use the same RAG pipeline in a future release.');
  }
}
