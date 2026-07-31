import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Notebook } from '../../common/types';
import { CreateNotebookDto } from './dto/notebook.dto';

@Injectable()
export class NotebooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: string): Promise<Notebook[]> {
    const rows = await this.prisma.notebook.findMany({
      where: userId ? { ownerId: userId } : undefined,
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((n) => this.toNotebook(n));
  }

  async findOne(id: string): Promise<Notebook> {
    const notebook = await this.prisma.notebook.findUnique({ where: { id } });
    if (!notebook) throw new NotFoundException(`Notebook ${id} not found`);
    return this.toNotebook(notebook);
  }

  async create(dto: CreateNotebookDto, userId?: string): Promise<Notebook> {
    const notebook = await this.prisma.notebook.create({
      data: {
        title: dto.title,
        course: dto.course ?? '',
        description: dto.description ?? '',
        subject: dto.subject ?? 'General',
        visibility: dto.visibility ?? 'Private',
        ownerId: userId,
        status: 'Processing',
        color: 'from-brand-500 to-accent-purple',
      },
    });
    return this.toNotebook(notebook);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const exists = await this.prisma.notebook.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Notebook ${id} not found`);
    await this.prisma.notebook.delete({ where: { id } });
    return { success: true };
  }

  private toNotebook(n: {
    id: string;
    title: string;
    course: string;
    description: string;
    subject: string;
    visibility: string;
    files: number;
    status: string;
    updatedAt: Date;
    color: string;
    questionsAsked: number;
  }): Notebook {
    return {
      id: n.id,
      title: n.title,
      course: n.course,
      description: n.description,
      subject: n.subject,
      visibility: n.visibility as Notebook['visibility'],
      files: n.files,
      status: n.status as Notebook['status'],
      updatedAt: n.updatedAt.toISOString(),
      color: n.color,
      questionsAsked: n.questionsAsked,
    };
  }
}
