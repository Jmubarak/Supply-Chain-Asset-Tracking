import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SensorNode {
    @PrimaryGeneratedColumn()
    nodeID: number;

    // Other columns and relations can be added as needed.
}
