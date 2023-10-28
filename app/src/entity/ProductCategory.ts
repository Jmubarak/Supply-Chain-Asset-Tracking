import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './Product';

@Entity()
export class ProductCategory {
    @PrimaryGeneratedColumn()
    categoryID: number;

    @Column()
    categoryName: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];
}
