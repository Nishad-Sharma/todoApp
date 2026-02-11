import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

@Entity() // 2do: can try entitySchema as well?
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        unique: true,
        length: 30
    })
    email: string;

    @Exclude() // omits password when serialising user
    @Column()
    password: string; // hash later
    
    @Column({
        type: 'simple-enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;
}
