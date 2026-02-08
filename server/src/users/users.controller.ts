import { Controller, Post, Body, UsePipes, ValidationPipe, Get, NotFoundException, Delete, Request, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/public.decorator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor) // intercepts user obj before it's serialised and applies decorators (@Exclude)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Post()
    // uses rules from DTO to check data. whitelist - culls extra fields not in DTO.
    // transform - converts JSON into DTO instance. strict types
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true })) 
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Get('me') // same as /auth/me? maybe remove this??
    async findOne(@Request() req) {
        const id = req.user.sub;
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found with id: ' + id);
        }
        return user;
    }

    @Delete('me')
    async remove(@Request() req) {
        return this.usersService.remove(req.user.sub);
    }
}
