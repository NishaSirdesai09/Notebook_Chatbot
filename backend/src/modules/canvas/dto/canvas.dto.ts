import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class ConnectCanvasDto {
  @IsString()
  @MinLength(1)
  token: string;

  @IsOptional()
  @IsString()
  baseUrl?: string;
}

export class SyncCanvasDto {
  @IsArray()
  @IsString({ each: true })
  courseIds: string[];
}
