import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Timestamp,
    BaseEntity,ManyToOne,OneToMany,ManyToMany,JoinTable, OneToOne, JoinColumn
  } from 'typeorm';
  
import { User } from './user.entity';
import { Platform } from '../enum/platform.enum'
  
  @Entity()
  export class DeviceDetails extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      type: 'varchar',
      length: 255,
      default: null,
    })
    device_id: string;
  
    @Column({
      type: 'varchar',
      length: 255,
      default: null,
    })
    device_token: string;

    @Column({
        type: 'smallint',
        default: 0,
      })
    build_version: string;

    @Column({
        type: 'varchar',
        length: 255,
        default: null,
      })
    build: string;

    @Column({
        type: 'varchar',
        length: 255,
        default: null,
      })
    build_mode: string;

    @Column({
        type  : 'enum',
        enum : Platform,
        default : null
    })
    platform: Platform;
  
    @ManyToOne(() => User, (user) => user.id)
    user: User;

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
  