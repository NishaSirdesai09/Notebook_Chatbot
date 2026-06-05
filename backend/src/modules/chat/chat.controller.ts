import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  ask(@Body() dto: ChatDto) {
    return this.chatService.ask(dto);
  }

  @Get('history/:notebookId')
  history(@Param('notebookId') notebookId: string) {
    return this.chatService.getHistory(notebookId);
  }
}
