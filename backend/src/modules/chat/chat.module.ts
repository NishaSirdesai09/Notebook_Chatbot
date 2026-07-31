import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [SettingsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
