import { IsOptional, IsString, MinLength } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  notebookId: string;

  @IsOptional()
  @IsString()
  type?: string;
}
