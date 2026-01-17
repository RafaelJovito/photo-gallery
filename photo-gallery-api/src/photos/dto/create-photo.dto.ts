import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreatePhotoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  dominantColor?: string;

  @IsOptional()
  @IsDateString()
  acquiredAt?: string;
}
