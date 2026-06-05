import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Notebook } from '../../common/types';
import { seedNotebooks } from '../../common/seed';
import { CreateNotebookDto } from './dto/notebook.dto';

@Injectable()
export class NotebooksService {
  // In-memory store — replace with a PostgreSQL repository.
  private notebooks: Notebook[] = [...seedNotebooks];

  findAll(): Notebook[] {
    return this.notebooks;
  }

  findOne(id: string): Notebook {
    const notebook = this.notebooks.find((n) => n.id === id);
    if (!notebook) throw new NotFoundException(`Notebook ${id} not found`);
    return notebook;
  }

  create(dto: CreateNotebookDto): Notebook {
    const notebook: Notebook = {
      id: `nb_${randomUUID()}`,
      title: dto.title,
      course: dto.course ?? '',
      description: dto.description ?? '',
      subject: dto.subject ?? 'General',
      visibility: dto.visibility ?? 'Private',
      files: 0,
      status: 'Processing',
      updatedAt: new Date().toISOString(),
      color: 'from-brand-500 to-accent-purple',
      questionsAsked: 0,
    };
    this.notebooks = [notebook, ...this.notebooks];
    return notebook;
  }

  remove(id: string): { success: boolean } {
    const exists = this.notebooks.some((n) => n.id === id);
    if (!exists) throw new NotFoundException(`Notebook ${id} not found`);
    this.notebooks = this.notebooks.filter((n) => n.id !== id);
    return { success: true };
  }
}
