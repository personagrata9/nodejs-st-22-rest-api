import { Transform } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

export class QueryDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  limit: number;

  @IsInt()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  offset: number;

  @IsOptional()
  loginSubstring: string;
}
