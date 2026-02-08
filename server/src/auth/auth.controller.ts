import { Controller, HttpCode, HttpStatus, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-auth.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }
}
