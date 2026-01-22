import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export enum TodoStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

export enum TodoPriority {
    NONE = 'NONE',
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'simple-enum',
        enum: TodoStatus,
        default: TodoStatus.PENDING,
    })
    status: TodoStatus;

    @Column({ nullable: true })
    category?: string;

    @Column({
        type: 'simple-enum',
        enum: TodoPriority,
        default: TodoPriority.NONE, // look into nullable vs enum.NONE?
    })
    priority: TodoPriority;

    // if we do sub-todo's later, look at adjacency list vs closure table
    // depends on parent/child depth but seems like closure better
    @ManyToOne(() => User, (user) => user.todos)
    user: User;
}
