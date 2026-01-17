/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
