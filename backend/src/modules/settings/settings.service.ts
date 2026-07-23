import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LlmConfigService } from '../llm/llm-config.service';

export type UserPreferenceDto = {
  studyMode?: string;
  responseLength?: string;
};

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmConfig: LlmConfigService,
  ) {}

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const prefs = await this.prisma.userPreference.findUnique({ where: { userId } });
    return {
      studyMode: prefs?.studyMode ?? 'balanced',
      responseLength: prefs?.responseLength ?? 'balanced',
    };
  }

  async updatePreferences(userId: string, dto: UserPreferenceDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        studyMode: dto.studyMode ?? 'balanced',
        responseLength: dto.responseLength ?? 'balanced',
      },
      update: {
        studyMode: dto.studyMode ?? undefined,
        responseLength: dto.responseLength ?? undefined,
      },
    });

    return this.getPreferences(userId);
  }

  /** Platform default model — not user-configurable */
  resolveModel() {
    return this.llmConfig.resolveDefaultModel();
  }

  resolveFallbackModels(primary: { providerId: string; modelId: string }) {
    return this.llmConfig.resolveFallbackModels(primary);
  }

  /** Platform env keys only — never exposed to students */
  resolveApiKey(providerId: string): string | undefined {
    const provider = this.llmConfig.getProvider(providerId);
    if (!provider) return undefined;
    return this.llmConfig.resolveApiKeyFromEnv(provider);
  }

  resolveEmbeddingApiKey(): string | undefined {
    const providerId = this.llmConfig.getEmbeddingConfig().providerId;
    return this.resolveApiKey(providerId);
  }

  async getStudyPreferences(userId: string) {
    return this.getPreferences(userId);
  }
}
