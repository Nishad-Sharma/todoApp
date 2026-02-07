import { Controller, Post, Body, UsePipes, ValidationPipe, Param, Get, NotFoundException, ParseIntPipe, Delete, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/public.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        if (req.user.sub !== id) {
            throw new ForbiddenException('You can only access your own user data');
        }
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found with id: ' + id);
        }
        return user;
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        if (req.user.sub !== id) {
            throw new ForbiddenException('You can only delete your own account');
        }
        return this.usersService.remove(id);
    }
}
