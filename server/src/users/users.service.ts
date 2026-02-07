import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}
    
    async findOne(id: number): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const user = this.usersRepository.create(createUserDto);
            return await this.usersRepository.save(user);
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') { // sqlite specific, for unique constraint check
                throw new ConflictException("User with this email already exists"); // conflictexception throws 409 status code here
            }
        throw error;
        }   
    }
}
