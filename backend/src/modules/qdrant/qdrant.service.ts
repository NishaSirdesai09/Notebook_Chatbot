import { Injectable, Logger, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import { randomUUID } from 'crypto';
import { LlmConfigService } from '../llm/llm-config.service';

export type ChunkPayload = {
  notebookId: string;
  documentId: string;
  documentName: string;
  docType: string;
  page: number;
  chunkIndex: number;
  content: string;
};

export type RetrievedChunk = ChunkPayload & {
  score: number;
  pointId: string;
};

@Injectable()
export class QdrantService implements OnModuleInit {
  private readonly logger = new Logger(QdrantService.name);
  private client!: QdrantClient;
  private collection!: string;
  private ready = false;

  constructor(
    private readonly env: ConfigService,
    private readonly llmConfig: LlmConfigService,
  ) {}

  async onModuleInit() {
    const url = this.env.get<string>('QDRANT_URL') ?? 'http://localhost:6333';
    this.collection = this.env.get<string>('QDRANT_COLLECTION') ?? 'notebook_chunks';
    this.client = new QdrantClient({ url, checkCompatibility: false });

    try {
      await this.ensureCollection();
      this.ready = true;
      this.logger.log(`Connected to Qdrant at ${url}`);
    } catch {
      this.logger.warn(
        `Qdrant not reachable at ${url}. Start it with: docker run -p 6333:6333 qdrant/qdrant`,
      );
    }
  }

  private async ensureCollection() {
    const { dimensions } = this.llmConfig.getEmbeddingConfig();
    const collections = await this.client.getCollections();
    const exists = collections.collections.some((c) => c.name === this.collection);
    if (!exists) {
      await this.client.createCollection(this.collection, {
        vectors: { size: dimensions, distance: 'Cosine' },
      });
      this.logger.log(`Created Qdrant collection "${this.collection}" (${dimensions}d)`);
    }
  }

  private async requireReady() {
    if (this.ready) return;
    try {
      await this.ensureCollection();
      this.ready = true;
    } catch {
      throw new ServiceUnavailableException(
        'Qdrant is not running. Start Docker Desktop, then run: docker run -p 6333:6333 qdrant/qdrant',
      );
    }
  }

  async upsertChunks(
    items: { vector: number[]; payload: ChunkPayload }[],
  ): Promise<void> {
    await this.requireReady();
    if (items.length === 0) return;
    await this.client.upsert(this.collection, {
      wait: true,
      points: items.map((item) => ({
        id: randomUUID(),
        vector: item.vector,
        payload: item.payload as Record<string, unknown>,
      })),
    });
  }

  async deleteByDocument(documentId: string): Promise<void> {
    await this.requireReady();
    await this.client.delete(this.collection, {
      wait: true,
      filter: {
        must: [{ key: 'documentId', match: { value: documentId } }],
      },
    });
  }

  async search(notebookId: string, vector: number[], topK: number): Promise<RetrievedChunk[]> {
    await this.requireReady();
    const results = await this.client.search(this.collection, {
      vector,
      limit: topK,
      with_payload: true,
      filter: {
        must: [{ key: 'notebookId', match: { value: notebookId } }],
      },
    });

    return results
      .map((hit) => {
        const payload = hit.payload as ChunkPayload;
        const referenceBoost = payload.docType === 'reference' ? 1.25 : 1;
        return {
          ...payload,
          pointId: String(hit.id),
          score: (hit.score ?? 0) * referenceBoost,
        };
      })
      .sort((a, b) => b.score - a.score);
  }
}
