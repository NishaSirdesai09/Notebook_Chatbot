import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdirSync, readFileSync, unlinkSync, writeFileSync, existsSync } from 'fs';
import { dirname, join, normalize, resolve, sep } from 'path';
import type { FileStorage, SaveFileInput, StoredFile } from './storage.interface';

@Injectable()
export class LocalStorageService implements FileStorage {
  private readonly root: string;

  constructor(env: ConfigService) {
    const configured = env.get<string>('UPLOAD_DIR') ?? join(process.cwd(), 'uploads');
    this.root = resolve(configured);
    mkdirSync(this.root, { recursive: true });
  }

  private resolve(key: string): string {
    const safe = normalize(key).replace(/^(\.\.(\/|\\|$))+/, '');
    const full = resolve(this.root, safe);
    const rootPrefix = this.root.endsWith(sep) ? this.root : `${this.root}${sep}`;
    if (!full.startsWith(rootPrefix)) {
      throw new Error('Invalid storage key');
    }
    return full;
  }

  async saveFile(input: SaveFileInput): Promise<StoredFile> {
    const path = this.resolve(input.key);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, input.buffer);
    return { key: input.key };
  }

  async getFile(key: string): Promise<Buffer> {
    return readFileSync(this.resolve(key));
  }

  async deleteFile(key: string): Promise<void> {
    const path = this.resolve(key);
    if (existsSync(path)) unlinkSync(path);
  }

  async fileExists(key: string): Promise<boolean> {
    return existsSync(this.resolve(key));
  }
}
