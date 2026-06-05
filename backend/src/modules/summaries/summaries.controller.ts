import { Body, Controller, Post } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { GenerateSummaryDto } from './dto/summary.dto';

@Controller('summaries')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Post('generate')
  generate(@Body() dto: GenerateSummaryDto) {
    return this.summariesService.generate(dto);
  }
}
