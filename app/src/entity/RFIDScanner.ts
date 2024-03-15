import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { SensorNode } from './SensorNode';

@Entity()
export class RFIDScanner {
    @PrimaryGeneratedColumn()
    scannerID: number;

    @ManyToOne(() => SensorNode, sensorNode => sensorNode.rfidScanners)
    @JoinColumn({ name: 'nodeID' })
    node: SensorNode;

    @Column({
        type: "varchar", // or "text" depending on the expected length
        nullable: true, // if the location is optional, otherwise remove this line
        comment: "The location of the RFID scanner"
    })
    location: string;
}
