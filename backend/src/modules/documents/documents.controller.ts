import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  upload(@Body() dto: UploadDocumentDto) {
    return this.documentsService.upload(dto);
  }

  @Get(':id/status')
  status(@Param('id') id: string) {
    return this.documentsService.status(id);
  }
}
