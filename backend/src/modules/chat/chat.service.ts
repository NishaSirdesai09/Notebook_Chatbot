import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatMessage, Citation } from '../../common/types';
import { AuthorizationService } from '../auth/authorization.service';
import { EmbeddingService } from '../embedding/embedding.service';
import { LlmService } from '../llm/llm.service';
import { QdrantService } from '../qdrant/qdrant.service';
import { SettingsService } from '../settings/settings.service';
import { ChatDto } from './dto/chat.dto';

const NOT_FOUND_MESSAGE =
  'I could not find this in your uploaded course material. Try adding more references or asking a more specific question.';

@Injectable()
export class ChatService {
  private readonly topK: number;
  private readonly scoreThreshold: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly embedding: EmbeddingService,
    private readonly qdrant: QdrantService,
    private readonly llm: LlmService,
    private readonly settings: SettingsService,
    private readonly authz: AuthorizationService,
    private readonly env: ConfigService,
  ) {
    this.topK = Number(this.env.get('RAG_TOP_K') ?? 8);
    this.scoreThreshold = Number(this.env.get('RAG_SCORE_THRESHOLD') ?? 0.35);
  }

  async ask(dto: ChatDto, userId: string): Promise<ChatMessage> {
    await this.authz.assertNotebookOwner(dto.notebookId, userId);

    const userMsg = await this.prisma.chatMessage.create({
      data: {
        role: 'user',
        content: dto.message,
        notebookId: dto.notebookId,
      },
    });

    const embedKey = this.settings.resolveEmbeddingApiKey();
    const queryVector = await this.embedding.embedOne(dto.message, embedKey);
    const chunks = await this.qdrant.search(dto.notebookId, queryVector, this.topK);
    const relevant = chunks.filter((c) => c.score >= this.scoreThreshold);

    if (relevant.length === 0) {
      const assistantMsg = await this.prisma.chatMessage.create({
        data: {
          role: 'assistant',
          content: NOT_FOUND_MESSAGE,
          notFound: true,
          notebookId: dto.notebookId,
        },
      });
      return this.toChatMessage(assistantMsg, []);
    }

    const { providerId, modelId } = this.settings.resolveModel();
    const fallbacks = this.settings.resolveFallbackModels({ providerId, modelId }).map((fb) => ({
      ...fb,
      apiKey: this.settings.resolveApiKey(fb.providerId),
    }));

    const prefs = await this.settings.getStudyPreferences(userId);
    const systemPrompt = this.buildSystemPrompt(prefs.studyMode, prefs.responseLength);
    const userPrompt = this.buildUserPrompt(dto.message, relevant);

    const chatApiKey = this.settings.resolveApiKey(providerId);

    let answer: string;
    try {
      answer = await this.llm.completeWithFallback(
        {
          providerId,
          modelId,
          system: systemPrompt,
          user: userPrompt,
          apiKey: chatApiKey,
        },
        fallbacks,
      );
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'LLM request failed';
      throw new ServiceUnavailableException(
        this.friendlyLlmError(detail),
      );
    }

    const citations: Citation[] = relevant.slice(0, 4).map((chunk, i) => ({
      id: `c_${randomUUID()}`,
      document: chunk.documentName,
      page: chunk.page,
      chapter: chunk.docType === 'reference' ? 'Professor Reference' : 'Course material',
      snippet: chunk.content.slice(0, 280) + (chunk.content.length > 280 ? '…' : ''),
    }));

    const assistantMsg = await this.prisma.chatMessage.create({
      data: {
        role: 'assistant',
        content: answer,
        notebookId: dto.notebookId,
        citations: {
          create: citations.map(({ document, page, chapter, snippet }) => ({
            document,
            page,
            chapter,
            snippet,
          })),
        },
      },
      include: { citations: true },
    });

    await this.prisma.notebook.update({
      where: { id: dto.notebookId },
      data: { questionsAsked: { increment: 1 } },
    });

    void userMsg;
    return this.toChatMessage(assistantMsg, assistantMsg.citations);
  }

  async getHistory(notebookId: string, userId: string): Promise<ChatMessage[]> {
    await this.authz.assertNotebookOwner(notebookId, userId);
    const rows = await this.prisma.chatMessage.findMany({
      where: { notebookId },
      include: { citations: true },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => this.toChatMessage(row, row.citations));
  }

  private friendlyLlmError(detail: string): string {
    if (/no_active_booking|GPU booking has expired/i.test(detail)) {
      return 'The DashLab GPU booking has expired. Set LLM_PROVIDER=ollama in backend/.env and run: ollama pull llama3.2';
    }
    if (/ECONNREFUSED|fetch failed/i.test(detail)) {
      return 'Could not reach the LLM server. Start Ollama locally or check your API key.';
    }
    return `Could not generate an answer: ${detail.slice(0, 200)}`;
  }

  private buildSystemPrompt(studyMode?: string, responseLength?: string) {
    const modeHints: Record<string, string> = {
      beginner: 'Use plain language suitable for someone new to the topic.',
      exam: 'Be concise and exam-focused with clear takeaways.',
      technical: 'Use precise business terminology and structured reasoning.',
      quick: 'Prefer short bullet-style takeaways.',
      balanced: 'Balance clarity with depth appropriate for MBA study.',
    };
    const lengthHints: Record<string, string> = {
      concise: 'Keep the answer brief (2-4 sentences).',
      detailed: 'Provide a thorough answer with examples when available.',
      balanced: 'Provide a clear, moderately detailed answer.',
    };

    return [
      'You are Notebook Chatbot, an AI study assistant for business school students.',
      'Answer ONLY using the provided context from the student\'s uploaded course materials.',
      'If the context is insufficient, say you could not find it in the uploaded material.',
      'Do not invent facts or cite sources not present in the context.',
      modeHints[studyMode ?? 'balanced'] ?? modeHints.balanced,
      lengthHints[responseLength ?? 'balanced'] ?? lengthHints.balanced,
    ].join(' ');
  }

  private buildUserPrompt(
    question: string,
    chunks: { documentName: string; page: number; docType: string; content: string }[],
  ) {
    const context = chunks
      .map(
        (c, i) =>
          `[${i + 1}] Document: ${c.documentName} (page ${c.page}, type: ${c.docType})\n${c.content}`,
      )
      .join('\n\n');

    return `Context from uploaded materials:\n\n${context}\n\nQuestion: ${question}`;
  }

  private toChatMessage(
    row: {
      id: string;
      role: string;
      content: string;
      explanation: string | null;
      keyPoints: unknown;
      practiceQuestion: string | null;
      notFound: boolean;
      citations?: { id: string; document: string; page: number; chapter: string; snippet: string }[];
    },
    citations: { id: string; document: string; page: number; chapter: string; snippet: string }[],
  ): ChatMessage {
    return {
      id: row.id,
      role: row.role as 'user' | 'assistant',
      content: row.content,
      explanation: row.explanation ?? undefined,
      keyPoints: Array.isArray(row.keyPoints)
        ? (row.keyPoints as string[])
        : row.keyPoints
          ? (JSON.parse(String(row.keyPoints)) as string[])
          : undefined,
      practiceQuestion: row.practiceQuestion ?? undefined,
      notFound: row.notFound || undefined,
      citations: citations.map((c) => ({
        id: c.id,
        document: c.document,
        page: c.page,
        chapter: c.chapter,
        snippet: c.snippet,
      })),
    };
  }
}
