import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import type { FileStorage, SaveFileInput, StoredFile } from './storage.interface';

@Injectable()
export class S3StorageService implements FileStorage {
  private readonly logger = new Logger(S3StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(env: ConfigService) {
    this.bucket = env.get<string>('S3_BUCKET') ?? 'notebook-chatbot';
    this.client = new S3Client({
      region: env.get<string>('S3_REGION') ?? 'auto',
      endpoint: env.get<string>('S3_ENDPOINT') || undefined,
      forcePathStyle: env.get<string>('S3_FORCE_PATH_STYLE') === 'true',
      credentials: {
        accessKeyId: env.get<string>('S3_ACCESS_KEY') ?? '',
        secretAccessKey: env.get<string>('S3_SECRET_KEY') ?? '',
      },
    });
    this.logger.log(`S3 storage configured for bucket "${this.bucket}"`);
  }

  async saveFile(input: SaveFileInput): Promise<StoredFile> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: input.key,
        Body: input.buffer,
        ContentType: input.mimeType,
        Metadata: { originalName: input.originalName },
      }),
    );
    return { key: input.key };
  }

  async getFile(key: string): Promise<Buffer> {
    const res = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    const bytes = await res.Body?.transformToByteArray();
    if (!bytes) throw new Error(`Empty object: ${key}`);
    return Buffer.from(bytes);
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return true;
    } catch {
      return false;
    }
  }
}
