import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        // 2do use bcrypt with salted one-way hash/ look at other options
        if (user?.password !== pass) {
            throw new UnauthorizedException('Invalid password or email');
        }

        // return everything except password
        // 2do generate JWT token and return instead of user obj
        const { password, ...result } = user;
        return result;
    }
}
