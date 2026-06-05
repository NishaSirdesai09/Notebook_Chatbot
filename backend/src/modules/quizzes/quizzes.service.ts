import { Injectable } from '@nestjs/common';
import { QuizQuestion } from '../../common/types';
import { seedQuiz } from '../../common/seed';
import { GenerateQuizDto } from './dto/quiz.dto';

@Injectable()
export class QuizzesService {
  /**
   * Generate `count` questions of the requested type/difficulty from material.
   * Production: retrieve chunks for the topic and prompt the LLM to produce
   * structured questions with answers and explanations.
   */
  generate(dto: GenerateQuizDto): QuizQuestion[] {
    const pool = seedQuiz;
    const result: QuizQuestion[] = [];
    for (let i = 0; i < dto.count; i++) {
      const base = pool[i % pool.length];
      result.push({ ...base, id: `q_${i + 1}` });
    }
    return result;
  }
}
