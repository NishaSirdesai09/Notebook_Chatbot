import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('notebookId') notebookId: string,
    @Body('type') type: string | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    return this.documentsService.upload(file, notebookId, user.id, type);
  }

  @Get('notebook/:notebookId')
  listByNotebook(@Param('notebookId') notebookId: string, @CurrentUser() user: AuthUser) {
    return this.documentsService.listByNotebook(notebookId, user.id);
  }

  @Get(':id/status')
  status(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.documentsService.status(id, user.id);
  }

  @Post(':id/retry')
  retry(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.documentsService.retry(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.documentsService.remove(id, user.id);
  }
}
