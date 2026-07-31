import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('notebookId') notebookId: string,
    @Body('type') type?: string,
  ) {
    if (!file) throw new BadRequestException('File is required');
    if (!notebookId) throw new BadRequestException('notebookId is required');
    return this.documentsService.upload(file, notebookId, type);
  }

  @Get('notebook/:notebookId')
  listByNotebook(@Param('notebookId') notebookId: string) {
    return this.documentsService.listByNotebook(notebookId);
  }

  @Get(':id/status')
  status(@Param('id') id: string) {
    return this.documentsService.status(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
