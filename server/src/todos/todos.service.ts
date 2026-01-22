import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Todo } from "./todo.entity"
import { User } from "../users/user.entity"

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todosRepository: Repository<Todo>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(userId: number): Promise<Todo[]> {
        return this.todosRepository.find( { where: { user: { id: userId } } });
    }

    async create(data: { title: string; userId: number; description?: string }): Promise<Todo> {
        const user = await this.usersRepository.findOneBy({ id: data.userId });
        if (!user) {
            throw new Error('User not found');
        }
        const todo = this.todosRepository.create({ title: data.title, user: user, description: data.description });
        return this.todosRepository.save(todo);
    }
}
