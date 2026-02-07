import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Todo } from "./todo.entity"
import { User } from "../users/user.entity"
import { UpdateTodoDto } from "./dto/update-todo.dto"
import { CreateTodoDto } from "./dto/create-todo.dto"

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todosRepository: Repository<Todo>, // data mapper > active record. seperates logic, easier testing, allows dependency inj.
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(userId: number): Promise<Todo[]> {
        return this.todosRepository.find( { where: { user: { id: userId } } });
    }

    async findOne(id: number, userId: number): Promise<Todo> {
        const todo = await this.todosRepository.findOne( { 
            where: { id: id, user: { id: userId } } 
        });
        if (!todo) {
            throw new NotFoundException('Todo not found, id: ' + id);
        }
        return todo;
    }

    // no ownership check here. user2 can create todo for user1 atm. will get fixed with JWT.
    async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> { 
        // userId passed in now from jwt.
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) { // keep for ghost user case.
            throw new NotFoundException('User not found');
        }
        const todo = this.todosRepository.create({
            ...createTodoDto,
            user: user
        })
        // insert vs save? save checks if id exists, if id exists then update else insert. returns todo obj. 
        // since we don't pass id in create, update never happens so, safe to use save.
        // insert just generates sql insert statement, faster but doesn't return todo obj, would need to query
        // for todo obj.
        return this.todosRepository.save(todo); 
    }

    async update(id: number, userId: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
        // uses id from url. change this later?? 
        const todo = await this.findOne(id, userId); // ownership check
        Object.assign(todo, updateTodoDto); // update todo obj with changes from updateDTO
        return this.todosRepository.save(todo);
    }

    async remove(id: number, userId: number): Promise<void> {
        const result = await this.todosRepository.delete({ id: id, user: { id: userId } });
        if (result.affected === 0) {
            throw new NotFoundException('Todo not found or not owned by user: id ' + id); 
        }
    }
}
