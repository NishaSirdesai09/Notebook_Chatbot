export type LlmModelConfig = {
  id: string;
  name: string;
  default?: boolean;
  maxTokens?: number;
};

export type LlmProviderConfig = {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyEnv?: string | null;
  requiresApiKey?: boolean;
  apiKeyHint?: string;
  models: LlmModelConfig[];
};

export type EmbeddingConfig = {
  providerId: string;
  model: string;
  dimensions: number;
};

export type LlmProvidersFile = {
  embedding: EmbeddingConfig;
  providers: LlmProviderConfig[];
};
