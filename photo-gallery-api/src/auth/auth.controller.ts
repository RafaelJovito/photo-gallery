import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService, AuthResponse } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: AuthDto): Promise<AuthResponse> {
    if (!body.name) {
      throw new BadRequestException('Name is required');
    }

    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: AuthDto): Promise<AuthResponse> {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
}
