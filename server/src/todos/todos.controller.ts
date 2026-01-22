import { Controller, Post, Get, Body } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @Post()
    createTodo(@Body() body: { title: string; userId: number; description?: string }) {
        return this.todosService.create(body);
    }

    @Get()
    getAllTodos(@Body() body: { userId: number }) {
        return this.todosService.findAll(body.userId);
    }
}
