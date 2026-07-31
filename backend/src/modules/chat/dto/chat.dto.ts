import { IsOptional, IsString, MinLength } from 'class-validator';

export class ChatDto {
  @IsString()
  @MinLength(1)
  notebookId: string;

  @IsString()
  @MinLength(1)
  message: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  llmProviderId?: string;

  @IsOptional()
  @IsString()
  llmModelId?: string;
}
