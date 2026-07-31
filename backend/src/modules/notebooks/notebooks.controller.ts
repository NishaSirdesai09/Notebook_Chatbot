import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/notebook.dto';

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.notebooksService.findAll(userId);
  }

  @Post()
  create(@Body() dto: CreateNotebookDto & { userId?: string }) {
    return this.notebooksService.create(dto, dto.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notebooksService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notebooksService.remove(id);
  }
}
