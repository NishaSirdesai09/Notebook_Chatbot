import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  async assertNotebookOwner(notebookId: string, userId: string) {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id: notebookId },
      select: { id: true, ownerId: true },
    });
    if (!notebook) throw new NotFoundException('Notebook not found');
    if (notebook.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this notebook');
    }
    return notebook;
  }

  async assertDocumentAccess(documentId: string, userId: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { notebook: { select: { ownerId: true } } },
    });
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.notebook.ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this document');
    }
    return doc;
  }
}
