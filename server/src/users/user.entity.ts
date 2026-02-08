import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
