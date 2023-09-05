import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,ManyToOne
  } from 'typeorm';
  
import { User } from './user.entity';
  
  @Entity()
  export class BlockedUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      type: 'text',
      default: null,
    })
    reason: string;
  
    @ManyToOne(() => User, (user) => user.id)
    blockedBy: User;

    @ManyToOne(() => User, (user) => user.id)
    blockedTo: User;

    @Column({
      type: 'timestamptz',
      default: () => "CURRENT_TIMESTAMP",
    })
    created_at: Date;
  
    @Column({
      type: 'timestamptz',
      default: () => "CURRENT_TIMESTAMP"
    })
    updated_at: Date;

  }
  