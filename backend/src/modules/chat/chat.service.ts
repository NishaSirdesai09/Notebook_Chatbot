import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChatMessage } from '../../common/types';
import { seedAssistantAnswer } from '../../common/seed';
import { ChatDto } from './dto/chat.dto';

const NOT_FOUND_MESSAGE =
  'I could not find this in your uploaded course material. Try adding more references or asking a more specific question.';

// Topics treated as outside the uploaded material for the demo.
const OFF_TOPIC = ['weather', 'stock', 'recipe', 'football', 'movie', 'celebrity'];

@Injectable()
export class ChatService {
  // In-memory conversation history keyed by notebookId.
  private history = new Map<string, ChatMessage[]>();

  /**
   * Produce an answer grounded ONLY in the notebook's material.
   *
   * Production flow:
   *   1. Embed the question.
   *   2. Retrieve top-k chunks from the vector DB for this notebook.
   *   3. If no relevant chunks pass the similarity threshold → return NOT_FOUND.
   *   4. Otherwise prompt the LLM with retrieved context and require citations.
   */
  ask(dto: ChatDto): ChatMessage {
    const userMsg: ChatMessage = {
      id: `u_${randomUUID()}`,
      role: 'user',
      content: dto.message,
    };

    const isOffTopic = OFF_TOPIC.some((w) => dto.message.toLowerCase().includes(w));

    const assistantMsg: ChatMessage = isOffTopic
      ? {
          id: `a_${randomUUID()}`,
          role: 'assistant',
          content: NOT_FOUND_MESSAGE,
          notFound: true,
        }
      : { ...seedAssistantAnswer, id: `a_${randomUUID()}` };

    const list = this.history.get(dto.notebookId) ?? [];
    list.push(userMsg, assistantMsg);
    this.history.set(dto.notebookId, list);

    return assistantMsg;
  }

  getHistory(notebookId: string): ChatMessage[] {
    return this.history.get(notebookId) ?? [];
  }
}
