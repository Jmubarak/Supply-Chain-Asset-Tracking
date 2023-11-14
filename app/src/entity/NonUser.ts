import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';  


@Entity()
export class NonUser {
  @PrimaryGeneratedColumn()
  nonUserID: number;

  @Column()
  name: string;

  @ManyToOne(() => User, user => user.nonUsersCreated)
  @JoinColumn({ name: 'createdByUserID' })
  createdByUser: User;

}
