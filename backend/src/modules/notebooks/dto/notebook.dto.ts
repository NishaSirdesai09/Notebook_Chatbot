import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { Visibility } from '../../../common/types';

export class CreateNotebookDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsIn(['Private', 'Shared with class'])
  visibility?: Visibility;
}
