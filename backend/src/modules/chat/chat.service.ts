import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatMessage, Citation } from '../../common/types';
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
    private readonly env: ConfigService,
  ) {
    this.topK = Number(this.env.get('RAG_TOP_K') ?? 8);
    this.scoreThreshold = Number(this.env.get('RAG_SCORE_THRESHOLD') ?? 0.55);
  }

  async ask(dto: ChatDto): Promise<ChatMessage> {
    const userMsg = await this.prisma.chatMessage.create({
      data: {
        role: 'user',
        content: dto.message,
        notebookId: dto.notebookId,
      },
    });

    const embedKey = await this.settings.resolveEmbeddingApiKey(dto.userId);
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

    const { providerId, modelId } = await this.settings.resolveModel(dto.userId);
    const overrideProvider = dto.llmProviderId ?? providerId;
    const overrideModel = dto.llmModelId ?? modelId;

    const prefs = dto.userId ? await this.settings.getSettings(dto.userId) : null;
    const systemPrompt = this.buildSystemPrompt(prefs?.studyMode, prefs?.responseLength);
    const userPrompt = this.buildUserPrompt(dto.message, relevant);

    const chatApiKey = dto.userId
      ? await this.settings.resolveApiKey(dto.userId, overrideProvider)
      : undefined;

    const answer = await this.llm.complete({
      providerId: overrideProvider,
      modelId: overrideModel,
      system: systemPrompt,
      user: userPrompt,
      apiKey: chatApiKey,
    });

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

  async getHistory(notebookId: string): Promise<ChatMessage[]> {
    const rows = await this.prisma.chatMessage.findMany({
      where: { notebookId },
      include: { citations: true },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => this.toChatMessage(row, row.citations));
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
      keyPoints: string | null;
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
      keyPoints: row.keyPoints ? (JSON.parse(row.keyPoints) as string[]) : undefined,
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
