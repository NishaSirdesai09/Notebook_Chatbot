import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class QuizzesService {
  generate(_input: { notebookId: string; count: number; difficulty: string; type: string }) {
    throw new NotImplementedException('Quizzes will use the same RAG pipeline in a future release.');
  }
}
