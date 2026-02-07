import { Controller, Post, Get, Body, ParseIntPipe, Query, Param, Patch, Delete } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
    // inject service into controller layer
    constructor(private readonly todosService: TodosService) {}

    @Post()
    createTodo(@Body() createTodoDto: CreateTodoDto) {
        return this.todosService.create(createTodoDto);
    }

    @Get()
    getAllTodos(@Query('userId', ParseIntPipe) userId: number) {
        return this.todosService.findAll(userId);
    }

    @Get(':id')
    getTodo(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseIntPipe) userId: number
    ) {
        return this.todosService.findOne(id, userId);
    }

    @Patch(':id')
    updateTodo(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseIntPipe) userId: number,
        @Body() updateTodoDto: UpdateTodoDto
    ) {
        return this.todosService.update(id, userId, updateTodoDto);
    }

    @Delete(':id')
    deleteTodo(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseIntPipe) userId: number
    ) {
        return this.todosService.remove(id, userId);
    }
}
