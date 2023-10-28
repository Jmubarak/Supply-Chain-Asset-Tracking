import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@Entity()
export class ShipmentOrder {
    @PrimaryGeneratedColumn()
    orderID: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productID' })
    product: Product;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'senderUserID' })
    sender: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'recipientUserID' })
    recipient: User;
}
