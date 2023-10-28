import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShipmentOrder } from './ShipmentOrder';

@Entity()
export class RFIDTag {
    @PrimaryGeneratedColumn()
    tagID: number;

    @ManyToOne(() => ShipmentOrder)
    @JoinColumn({ name: 'associatedOrderID' })
    associatedOrder: ShipmentOrder;
}
