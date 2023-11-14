import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';
import { User } from './User';  

@Entity()
export class ProductCategory {
    @PrimaryGeneratedColumn()
    categoryID: number;

    @Column()
    categoryName: string;

    @ManyToOne(() => User, user => user.categories)
    @JoinColumn({ name: 'userID' })  
    user: User;

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}
