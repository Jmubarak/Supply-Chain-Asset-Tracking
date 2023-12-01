import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RFIDScanner } from './RFIDScanner';

@Entity()
export class SensorNode {
    @PrimaryGeneratedColumn()
    nodeID: number;

    @OneToMany(() => RFIDScanner, rfidScanner => rfidScanner.node)
    rfidScanners: RFIDScanner[];
}
