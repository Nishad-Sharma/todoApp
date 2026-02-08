import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signIn(email: string, pass: string): Promise<{ accessToken: string }> {
        const user = await this.usersService.findOneByEmail(email);
        // should we have two errors for invalid email vs password?
        // no, specifying error gives info to attacker, keep it generic.
        if (!user || !(await argon2.verify(user.password, pass))) {
            throw new UnauthorizedException('Invalid password or email'); 
        }
        const payload = { sub: user.id, email: user.email }; // sub to hold userId is standard with jwt

        return {
            accessToken: await this.jwtService.signAsync(payload)
        };
    }
}
