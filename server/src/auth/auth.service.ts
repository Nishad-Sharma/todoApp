import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signIn(email: string, pass: string): Promise<{ accessToken: string }> {
        const user = await this.usersService.findOneByEmail(email);
        // 2do use bcrypt with salted one-way hash/ look at other options
        if (user?.password !== pass) {
            throw new UnauthorizedException('Invalid password or email');
        }

        const payload = { sub: user.id, email: user.email }; // sub to hold userId is standard with jwt

        return {
            accessToken: await this.jwtService.signAsync(payload)
        };
    }
}
