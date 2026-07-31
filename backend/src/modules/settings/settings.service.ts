import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LlmConfigService } from '../llm/llm-config.service';

export type UserSettingsDto = {
  llmProviderId?: string | null;
  llmModelId?: string | null;
  llmApiKey?: string | null;
  studyMode?: string;
  responseLength?: string;
};

type ApiKeyMap = Record<string, string>;

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmConfig: LlmConfigService,
  ) {}

  listLlmCatalog() {
    return this.llmConfig.listPublicCatalog();
  }

  private parseApiKeys(raw: string | null | undefined): ApiKeyMap {
    if (!raw) return {};
    try {
      return JSON.parse(raw) as ApiKeyMap;
    } catch {
      return {};
    }
  }

  private maskApiKeyStatus(keys: ApiKeyMap, providerIds: string[]) {
    return Object.fromEntries(
      providerIds.map((id) => [id, Boolean(keys[id]?.trim())]),
    );
  }

  async getSettings(userId: string) {
    const settings = await this.prisma.userSettings.findUnique({ where: { userId } });
    const defaults = this.llmConfig.resolveDefaultModel();
    const keys = this.parseApiKeys(settings?.providerApiKeys);
    const providerId = settings?.llmProviderId ?? defaults.providerId;
    const embeddingProvider = this.llmConfig.getEmbeddingConfig().providerId;

    return {
      llmProviderId: providerId,
      llmModelId: settings?.llmModelId ?? defaults.modelId,
      studyMode: settings?.studyMode ?? 'balanced',
      responseLength: settings?.responseLength ?? 'balanced',
      apiKeyStatus: this.maskApiKeyStatus(keys, [providerId, embeddingProvider]),
      activeProviderRequiresKey: this.llmConfig.providerRequiresApiKey(providerId),
      embeddingProviderRequiresKey: this.llmConfig.providerRequiresApiKey(embeddingProvider),
    };
  }

  async updateSettings(userId: string, dto: UserSettingsDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.userSettings.findUnique({ where: { userId } });
    const keys = this.parseApiKeys(existing?.providerApiKeys);

    const providerId = dto.llmProviderId ?? existing?.llmProviderId;
    const modelId = dto.llmModelId ?? existing?.llmModelId;

    if (providerId && modelId) {
      const provider = this.llmConfig.getProvider(providerId);
      const model = provider?.models.find((m) => m.id === modelId);
      if (!provider || !model) {
        throw new NotFoundException('Invalid LLM provider or model');
      }
    }

    if (dto.llmApiKey !== undefined && providerId) {
      const trimmed = dto.llmApiKey?.trim() ?? '';
      if (trimmed) {
        keys[providerId] = trimmed;
      } else {
        delete keys[providerId];
      }
    }

    await this.prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        llmProviderId: providerId ?? null,
        llmModelId: modelId ?? null,
        providerApiKeys: Object.keys(keys).length ? JSON.stringify(keys) : null,
        studyMode: dto.studyMode ?? 'balanced',
        responseLength: dto.responseLength ?? 'balanced',
      },
      update: {
        llmProviderId: dto.llmProviderId ?? undefined,
        llmModelId: dto.llmModelId ?? undefined,
        providerApiKeys: Object.keys(keys).length ? JSON.stringify(keys) : null,
        studyMode: dto.studyMode ?? undefined,
        responseLength: dto.responseLength ?? undefined,
      },
    });

    return this.getSettings(userId);
  }

  async resolveModel(userId?: string) {
    if (userId) {
      const settings = await this.getSettings(userId);
      return { providerId: settings.llmProviderId, modelId: settings.llmModelId };
    }
    return this.llmConfig.resolveDefaultModel();
  }

  /** User-saved key first, then server env fallback from llm.providers.json */
  async resolveApiKey(userId: string | undefined, providerId: string): Promise<string | undefined> {
    const provider = this.llmConfig.getProvider(providerId);
    if (!provider) return undefined;

    if (userId) {
      const settings = await this.prisma.userSettings.findUnique({ where: { userId } });
      const keys = this.parseApiKeys(settings?.providerApiKeys);
      const userKey = keys[providerId]?.trim();
      if (userKey) return userKey;
    }

    return this.llmConfig.resolveApiKeyFromEnv(provider);
  }

  async resolveApiKeyForNotebook(notebookId: string, providerId: string): Promise<string | undefined> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id: notebookId },
      select: { ownerId: true },
    });
    return this.resolveApiKey(notebook?.ownerId ?? undefined, providerId);
  }

  async resolveEmbeddingApiKey(userId?: string): Promise<string | undefined> {
    const providerId = this.llmConfig.getEmbeddingConfig().providerId;
    return this.resolveApiKey(userId, providerId);
  }
}
