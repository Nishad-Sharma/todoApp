import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { TodoPriority, TodoStatus } from '../todo.entity';

export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    userId: number | string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category?: string;
    
    @IsOptional()
    @IsEnum(TodoPriority)
    priority?: TodoPriority;

    // don't let user set status on create? maybe remove later
    @IsOptional()
    @IsEnum(TodoStatus)
    status?: TodoStatus;
}
