import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

type AuthenticatedRequest = Request & {
    user: {
        userId: number;
        username: string;
    }
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password)
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: AuthenticatedRequest) {
        return req.user
    }
}
