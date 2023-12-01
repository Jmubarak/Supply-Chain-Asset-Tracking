import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SensorNode } from './SensorNode';

@Entity()
export class RFIDScanner {
    @PrimaryGeneratedColumn()
    scannerID: number;

    @ManyToOne(() => SensorNode, sensorNode => sensorNode.rfidScanners)
    @JoinColumn({ name: 'nodeID' })
    node: SensorNode;
}
