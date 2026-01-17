import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthDto): Promise<AuthResponse> {
    const { name, email, password } = dto;

    if (!name) {
      throw new UnauthorizedException('Name is required');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      name,
      email,
      password: hash,
    });

    return this.buildAuthResponse(user);
  }

  async login(user: User): Promise<AuthResponse> {
    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User): AuthResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
