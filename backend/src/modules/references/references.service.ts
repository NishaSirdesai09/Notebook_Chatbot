import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ReferenceLink } from '../../common/types';
import { seedReferences } from '../../common/seed';
import { CreateReferenceDto } from './dto/reference.dto';

@Injectable()
export class ReferencesService {
  private references: ReferenceLink[] = [...seedReferences];

  findAll(): ReferenceLink[] {
    return this.references;
  }

  /**
   * Add an external resource and queue it for indexing.
   * Production: fetch the URL, extract content, embed, and index.
   */
  create(dto: CreateReferenceDto): ReferenceLink {
    const link: ReferenceLink = {
      id: `r_${randomUUID()}`,
      url: dto.url,
      title: dto.title,
      category: dto.category,
      status: 'Indexing',
      addedAt: new Date().toISOString(),
    };
    this.references = [link, ...this.references];
    return link;
  }
}
