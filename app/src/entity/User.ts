import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './Product';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userID: number;

    @Column()
    name: string;

    @Column({ unique: true })  
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @OneToMany(() => Product, product => product.user)
    products: Product[];
}
