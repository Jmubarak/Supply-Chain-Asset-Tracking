import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { ProductCategory } from './ProductCategory';
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    productID: number;

    @ManyToOne(() => User, user => user.products)
    @JoinColumn({ name: 'userID' })
    user: User;

    @Column()
    categoryID: number;

    @Column()
    productName: string;

    @ManyToOne(() => ProductCategory, category => category.products)
    @JoinColumn({ name: 'categoryID' })
    category: ProductCategory;
}
