import { Injectable } from '@nestjs/common';
import { ReferenceLink } from '../../common/types';

@Injectable()
export class ReferencesService {
  private references: ReferenceLink[] = [];

  list(): ReferenceLink[] {
    return this.references;
  }

  add(input: { url: string; title: string; category: string }): ReferenceLink {
    const link: ReferenceLink = {
      id: `r_${Date.now()}`,
      url: input.url,
      title: input.title,
      category: input.category,
      status: 'Indexing',
      addedAt: new Date().toISOString(),
    };
    this.references = [link, ...this.references];
    return link;
  }
}
