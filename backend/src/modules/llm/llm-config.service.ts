import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import type {
  EmbeddingConfig,
  LlmModelConfig,
  LlmProviderConfig,
  LlmProvidersFile,
} from '../../config/llm-config.types';

@Injectable()
export class LlmConfigService implements OnModuleInit {
  private readonly logger = new Logger(LlmConfigService.name);
  private config!: LlmProvidersFile;

  constructor(private readonly env: ConfigService) {}

  onModuleInit() {
    const configPath =
      this.env.get<string>('LLM_CONFIG_PATH') ??
      join(process.cwd(), 'config', 'llm.providers.json');
    const raw = readFileSync(configPath, 'utf-8');
    this.config = JSON.parse(raw) as LlmProvidersFile;
    this.logger.log(`Loaded LLM config from ${configPath}`);
  }

  getProviders(): LlmProviderConfig[] {
    return this.config.providers;
  }

  getEmbeddingConfig(): EmbeddingConfig {
    return this.config.embedding;
  }

  getProvider(providerId: string): LlmProviderConfig | undefined {
    return this.config.providers.find((p) => p.id === providerId);
  }

  getModel(providerId: string, modelId: string): LlmModelConfig | undefined {
    return this.getProvider(providerId)?.models.find((m) => m.id === modelId);
  }

  resolveDefaultModel(): { providerId: string; modelId: string } {
    const envProvider = this.env.get<string>('LLM_PROVIDER');
    const envModel = this.env.get<string>('LLM_MODEL');
    if (envProvider) {
      const provider = this.getProvider(envProvider);
      if (!provider) throw new Error(`Unknown LLM_PROVIDER: ${envProvider}`);
      const model =
        (envModel && this.getModel(envProvider, envModel)) ??
        provider.models.find((m) => m.default) ??
        provider.models[0];
      if (!model) throw new Error(`No models configured for provider ${envProvider}`);
      return { providerId: envProvider, modelId: model.id };
    }

    for (const provider of this.config.providers) {
      const model = provider.models.find((m) => m.default) ?? provider.models[0];
      if (model) return { providerId: provider.id, modelId: model.id };
    }
    throw new Error('No LLM models configured in llm.providers.json');
  }

  /** Ordered providers to try when the primary chat model fails (e.g. expired GPU booking). */
  resolveFallbackModels(primary: { providerId: string; modelId: string }) {
    const preferredOrder = ['ollama', 'openai', 'dashlab'];
    const fallbacks: { providerId: string; modelId: string }[] = [];

    for (const id of preferredOrder) {
      const provider = this.getProvider(id);
      if (!provider) continue;
      const model = provider.models.find((m) => m.default) ?? provider.models[0];
      if (!model) continue;
      if (provider.id === primary.providerId && model.id === primary.modelId) continue;
      fallbacks.push({ providerId: provider.id, modelId: model.id });
    }

    for (const provider of this.config.providers) {
      const model = provider.models.find((m) => m.default) ?? provider.models[0];
      if (!model) continue;
      if (provider.id === primary.providerId && model.id === primary.modelId) continue;
      if (fallbacks.some((f) => f.providerId === provider.id && f.modelId === model.id)) continue;
      fallbacks.push({ providerId: provider.id, modelId: model.id });
    }

    return fallbacks;
  }

  resolveApiKey(provider: LlmProviderConfig): string | undefined {
    return this.resolveApiKeyFromEnv(provider);
  }

  resolveApiKeyFromEnv(provider: LlmProviderConfig): string | undefined {
    if (!provider.apiKeyEnv) return undefined;
    return this.env.get<string>(provider.apiKeyEnv) || undefined;
  }

  providerRequiresApiKey(providerId: string): boolean {
    const provider = this.getProvider(providerId);
    if (!provider) return false;
    if (provider.requiresApiKey === false) return false;
    return provider.requiresApiKey === true || Boolean(provider.apiKeyEnv);
  }

  listPublicCatalog() {
    return this.config.providers.map((p) => ({
      id: p.id,
      name: p.name,
      requiresApiKey: this.providerRequiresApiKey(p.id),
      apiKeyHint: p.apiKeyHint ?? (p.apiKeyEnv ? `Set ${p.apiKeyEnv} on the server or save your key below` : undefined),
      models: p.models.map((m) => ({ id: m.id, name: m.name, default: !!m.default })),
    }));
  }
}
