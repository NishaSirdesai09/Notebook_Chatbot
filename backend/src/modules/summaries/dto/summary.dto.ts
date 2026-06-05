import { IsOptional, IsString, MinLength } from 'class-validator';

export class GenerateSummaryDto {
  @IsString()
  @MinLength(1)
  notebookId: string;

  @IsString()
  @MinLength(1)
  type: string;

  @IsOptional()
  @IsString()
  chapter?: string;
}
