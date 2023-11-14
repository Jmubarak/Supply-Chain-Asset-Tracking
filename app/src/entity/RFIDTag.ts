import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShipmentOrder } from './ShipmentOrder';
import { User } from './User';

@Entity()
export class RFIDTag {
    @PrimaryGeneratedColumn()
    tagID: number;

    @ManyToOne(() => ShipmentOrder)
    @JoinColumn({ name: 'associatedOrderID' })
    associatedOrder: ShipmentOrder;

    // New relationship with User
    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdByUserID' })
    createdByUser: User;
}
