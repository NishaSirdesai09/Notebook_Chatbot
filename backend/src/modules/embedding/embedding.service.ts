import { Injectable, Logger } from '@nestjs/common';
import { LlmConfigService } from '../llm/llm-config.service';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(private readonly config: LlmConfigService) {}

  async embed(texts: string[], apiKey?: string): Promise<number[][]> {
    if (texts.length === 0) return [];

    const embeddingCfg = this.config.getEmbeddingConfig();
    const provider = this.config.getProvider(embeddingCfg.providerId);
    if (!provider) {
      throw new Error(`Embedding provider not found: ${embeddingCfg.providerId}`);
    }

    const resolvedKey = apiKey ?? this.config.resolveApiKeyFromEnv(provider);
    const url = `${provider.baseUrl.replace(/\/$/, '')}/embeddings`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(resolvedKey ? { Authorization: `Bearer ${resolvedKey}` } : {}),
      },
      body: JSON.stringify({
        model: embeddingCfg.model,
        input: texts,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      this.logger.error(`Embedding request failed (${res.status}): ${errText}`);
      throw new Error(`Embedding request failed: ${errText}`);
    }

    const data = (await res.json()) as {
      data?: { embedding: number[] }[];
    };

    const vectors = data.data?.map((d) => d.embedding) ?? [];
    if (vectors.length !== texts.length) {
      throw new Error('Embedding API returned unexpected result count');
    }
    return vectors;
  }

  async embedOne(text: string, apiKey?: string): Promise<number[]> {
    const [vector] = await this.embed([text], apiKey);
    return vector;
  }
}
