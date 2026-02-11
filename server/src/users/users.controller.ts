import { Controller, Post, Body, UsePipes, ValidationPipe, Get, NotFoundException, Delete, Request, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/public.decorator';
import { UserRole } from './user.entity';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';

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

    @Get()
    @Roles(UserRole.ADMIN)
    @UseGuards(AuthGuard, RolesGuard) // run authguard first
    findAll() {
        return this.usersService.findAll(); // You need to ensure this method exists in UsersService
    }

    @Delete('me')
    async remove(@Request() req) {
        return this.usersService.remove(req.user.sub);
    }
}
