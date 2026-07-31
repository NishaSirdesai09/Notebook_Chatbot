import { Injectable, Logger } from '@nestjs/common';
import { LlmConfigService } from './llm-config.service';

export type ChatCompletionInput = {
  providerId: string;
  modelId: string;
  system: string;
  user: string;
  maxTokens?: number;
  apiKey?: string;
};

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private readonly config: LlmConfigService) {}

  async complete(input: ChatCompletionInput): Promise<string> {
    const provider = this.config.getProvider(input.providerId);
    if (!provider) throw new Error(`Unknown LLM provider: ${input.providerId}`);

    const model = this.config.getModel(input.providerId, input.modelId);
    if (!model) throw new Error(`Unknown model: ${input.modelId}`);

    const apiKey = input.apiKey ?? this.config.resolveApiKeyFromEnv(provider);
    const url = `${provider.baseUrl.replace(/\/$/, '')}/chat/completions`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: input.modelId,
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.user },
        ],
        max_tokens: input.maxTokens ?? model.maxTokens ?? 2048,
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      this.logger.error(`LLM request failed (${res.status}): ${errText}`);
      throw new Error(`LLM request failed: ${errText}`);
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('LLM returned empty response');
    return content;
  }
}
