import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateQuizDto {
  @IsString()
  @MinLength(1)
  notebookId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  count: number;

  @IsString()
  difficulty: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  topic?: string;
}
