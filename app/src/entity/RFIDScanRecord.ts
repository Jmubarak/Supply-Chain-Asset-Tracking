import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RFIDScanner } from './RFIDScanner';
import { RFIDTag } from './RFIDTag';

@Entity()
export class RFIDScanRecord {
    @PrimaryGeneratedColumn()
    recordID: number;

    @ManyToOne(() => RFIDScanner)
    @JoinColumn({ name: 'scannerID' })
    scanner: RFIDScanner;

    @ManyToOne(() => RFIDTag)
    @JoinColumn({ name: 'tagID' })
    tag: RFIDTag;

    @Column()
    scanTimestamp: Date;
}
