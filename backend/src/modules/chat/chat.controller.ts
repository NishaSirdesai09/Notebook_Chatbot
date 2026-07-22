import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  ask(@Body() dto: ChatDto, @CurrentUser() user: AuthUser) {
    return this.chatService.ask(dto, user.id);
  }

  @Get('history/:notebookId')
  history(@Param('notebookId') notebookId: string, @CurrentUser() user: AuthUser) {
    return this.chatService.getHistory(notebookId, user.id);
  }
}
