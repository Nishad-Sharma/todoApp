import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { User } from '../users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Todo, User])],
    controllers: [TodosController],
    providers: [TodosService],
    exports: [TodosService],
})
export class TodosModule {}