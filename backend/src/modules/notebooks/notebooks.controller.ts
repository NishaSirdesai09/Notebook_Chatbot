import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/notebook.dto';

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.notebooksService.findAll(user.id);
  }

  @Post()
  create(@Body() dto: CreateNotebookDto, @CurrentUser() user: AuthUser) {
    return this.notebooksService.create(dto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notebooksService.findOne(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notebooksService.remove(id, user.id);
  }
}
