import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { DocType } from '../../common/types';

export type PageText = { page: number; text: string };

@Injectable()
export class PdfExtractService {
  private readonly logger = new Logger(PdfExtractService.name);
  private readonly minTextLength: number;

  constructor(env: ConfigService) {
    this.minTextLength = Number(env.get('PDF_MIN_TEXT_LENGTH') ?? 40);
  }

  async extractPages(buffer: Buffer, type: DocType): Promise<PageText[]> {
    if (type === 'txt') {
      return [{ page: 1, text: buffer.toString('utf-8').replace(/\s+/g, ' ').trim() }];
    }

    if (type === 'pdf' || type === 'reference') {
      const doc = await getDocument({
        data: new Uint8Array(buffer),
        useSystemFonts: true,
      }).promise;

      const pages: PageText[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (text.length >= this.minTextLength) {
          pages.push({ page: i, text });
        }
      }

      if (pages.length === 0) {
        throw new Error(
          'No extractable text found. This may be a scanned PDF — OCR is not yet supported.',
        );
      }

      this.logger.debug(`Extracted ${pages.length} pages from PDF`);
      return pages;
    }

    throw new Error(`Unsupported file type for ingestion: ${type}`);
  }
}
