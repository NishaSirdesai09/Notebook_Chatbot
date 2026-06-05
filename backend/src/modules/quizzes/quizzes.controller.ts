import { Body, Controller, Post } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { GenerateQuizDto } from './dto/quiz.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('generate')
  generate(@Body() dto: GenerateQuizDto) {
    return this.quizzesService.generate(dto);
  }
}
