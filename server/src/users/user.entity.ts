import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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
}
