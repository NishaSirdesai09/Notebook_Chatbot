import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotebooksModule } from './modules/notebooks/notebooks.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ChatModule } from './modules/chat/chat.module';
import { SummariesModule } from './modules/summaries/summaries.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { ReferencesModule } from './modules/references/references.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    NotebooksModule,
    DocumentsModule,
    ChatModule,
    SummariesModule,
    QuizzesModule,
    CanvasModule,
    ReferencesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
