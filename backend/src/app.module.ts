import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PrismaModule } from './prisma/prisma.module';
import { LlmModule } from './modules/llm/llm.module';
import { EmbeddingModule } from './modules/embedding/embedding.module';
import { QdrantModule } from './modules/qdrant/qdrant.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotebooksModule } from './modules/notebooks/notebooks.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ChatModule } from './modules/chat/chat.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SummariesModule } from './modules/summaries/summaries.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { ReferencesModule } from './modules/references/references.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    LlmModule,
    EmbeddingModule,
    QdrantModule,
    AuthModule,
    NotebooksModule,
    DocumentsModule,
    ChatModule,
    SettingsModule,
    SummariesModule,
    QuizzesModule,
    CanvasModule,
    ReferencesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
