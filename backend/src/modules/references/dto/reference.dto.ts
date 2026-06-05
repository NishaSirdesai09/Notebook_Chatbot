import { IsString, MinLength } from 'class-validator';

export class CreateReferenceDto {
  @IsString()
  @MinLength(1)
  url: string;

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  category: string;
}
