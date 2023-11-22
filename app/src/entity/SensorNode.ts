import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SensorNode {
    @PrimaryGeneratedColumn()
    nodeID: number;
}
