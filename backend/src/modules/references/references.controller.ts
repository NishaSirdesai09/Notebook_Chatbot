import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { CreateReferenceDto } from './dto/reference.dto';

@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Get()
  findAll() {
    return this.referencesService.list();
  }

  @Post()
  create(@Body() dto: CreateReferenceDto) {
    return this.referencesService.add(dto);
  }
}
