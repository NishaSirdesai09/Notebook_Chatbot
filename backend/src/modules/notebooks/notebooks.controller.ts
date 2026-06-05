import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/notebook.dto';

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Get()
  findAll() {
    return this.notebooksService.findAll();
  }

  @Post()
  create(@Body() dto: CreateNotebookDto) {
    return this.notebooksService.create(dto);
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
