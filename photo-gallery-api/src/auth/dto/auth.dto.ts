import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class AuthDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
