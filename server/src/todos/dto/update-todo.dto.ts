import { IsEnum, IsOptional, IsString } from "class-validator";
import { TodoPriority, TodoStatus } from "../todo.entity";

// 2do: look into mapped/partial types
export class UpdateTodoDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TodoStatus)
    status?: TodoStatus;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsEnum(TodoPriority)
    priority?: TodoPriority;
}
