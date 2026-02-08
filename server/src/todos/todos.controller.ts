import { Controller, Post, Get, Body, ParseIntPipe, Param, Patch, Delete, Request } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
    // inject service into controller layer
    constructor(private readonly todosService: TodosService) {}
    // 2do: should todos endpoint be under users? since user specific?
    @Post()
    createTodo(@Body() createTodoDto: CreateTodoDto, @Request() req) {
        return this.todosService.create(createTodoDto, req.user.sub);
    }

    @Get()
    getAllTodos(@Request() req) {
        return this.todosService.findAll(req.user.sub);
    }

    @Get(':id')
    getTodo(
        @Param('id', ParseIntPipe) id: number,
        @Request() req
    ) {
        return this.todosService.findOne(id, req.user.sub);
    }

    @Patch(':id')
    updateTodo(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() updateTodoDto: UpdateTodoDto
    ) {
        return this.todosService.update(id, req.user.sub, updateTodoDto);
    }

    @Delete(':id')
    deleteTodo(
        @Param('id', ParseIntPipe) id: number,
        @Request() req
    ) {
        return this.todosService.remove(id, req.user.sub);
    }
}
