import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './Product';
import { ProductCategory } from './ProductCategory'; 
import { NonUser } from './NonUser';  

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

    
    @OneToMany(() => ProductCategory, category => category.user)
    categories: ProductCategory[];


    @OneToMany(() => NonUser, nonUser => nonUser.createdByUser)
    nonUsersCreated: NonUser[];
}
