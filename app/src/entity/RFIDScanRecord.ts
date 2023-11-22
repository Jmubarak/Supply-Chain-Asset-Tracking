import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,CreateDateColumn  } from 'typeorm';
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

    @CreateDateColumn()
    scanTimestamp: Date;
}
