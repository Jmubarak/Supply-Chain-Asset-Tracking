import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SensorNode } from './SensorNode';

@Entity()
export class RFIDScanner {
    @PrimaryGeneratedColumn()
    scannerID: number;

    @ManyToOne(() => SensorNode)
    @JoinColumn({ name: 'nodeID' })
    node: SensorNode;

    
}
