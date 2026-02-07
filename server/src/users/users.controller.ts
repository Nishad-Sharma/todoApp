import { Controller, Post, Body, UsePipes, ValidationPipe, Param, Get, NotFoundException, ParseIntPipe, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found with id: ' + id);
        }
        return user;
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }
}
