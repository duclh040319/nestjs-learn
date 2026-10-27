import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(email: string, password: string) {
    
    const user = await this.userService.findByEmailWithPassword(email);

    if(!user?.password) {
        throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials')
    }

    const payload = {
        sub: user.id,
        email: user.email
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
