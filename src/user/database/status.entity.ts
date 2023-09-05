import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Timestamp,
    BaseEntity,
  } from 'typeorm';
  
  @Entity()
  export class Status extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      type: 'varchar',
      length: 100,
      default: null,
    })
    name: string;
  
    @Column({
      type: 'timestamp',
      default: null,
    })
    created_at: Timestamp;
  
    @Column({
      type: 'timestamp',
      default: null,
    })
    updated_at: Timestamp;
  }
  