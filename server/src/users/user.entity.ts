import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Todo } from '../todos/todo.entity';

@Entity() // 2do: can try entitySchema as well?
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        unique: true,
        length: 30
    })
    email: string;

    @Column()
    password: string; // hash later

    // todo table stores FK, userID column
    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[]; 
}
