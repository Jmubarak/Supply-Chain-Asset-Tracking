import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { NonUser } from './NonUser';  // Import the NonUser entity
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

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'recipientUserID' })
    recipientUser: User | null;

    @ManyToOne(() => NonUser, { nullable: true })
    @JoinColumn({ name: 'recipientNonUserID' })
    recipientNonUser: NonUser | null;

    @Column({ type: 'int' })
    quantity: number;

    @CreateDateColumn()
    shipmentDate: Date;

    @Column({
        type: 'enum',
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    })
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}
