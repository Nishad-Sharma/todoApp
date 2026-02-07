import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Invalid email address' }) // 2do: add already in use later check later
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Password can not be empty' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}
