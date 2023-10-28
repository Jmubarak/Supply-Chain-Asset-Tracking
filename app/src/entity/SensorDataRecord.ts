import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SensorNode } from './SensorNode';

@Entity()
export class SensorDataRecord {
    @PrimaryGeneratedColumn()
    recordID: number;

    @ManyToOne(() => SensorNode)
    @JoinColumn({ name: 'nodeID' })
    node: SensorNode;

    @Column()
    timestamp: Date;

    @Column()
    dataType: string;

    @Column()
    dataValue: string;
}
