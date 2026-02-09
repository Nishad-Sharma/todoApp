import { Controller, HttpCode, HttpStatus, Post, Body, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';
import { Public } from './public.decorator';
import * as express from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: express.Response) {
        const { accessToken } = await this.authService.signIn(signInDto.email, signInDto.password);
        response.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 600 * 1000) // 10 minutes
        });
        return { message: 'Login successful' };
    }

    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }
}
