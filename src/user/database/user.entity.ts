import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn, DeleteDateColumn
} from 'typeorm';

import { Status } from "./status.entity";
import { Roles } from "../../roles/database/roles.entity";





@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({
    type: 'varchar',
    length: 100,
    default: null,
  })
  name: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 100,
  })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'date',
    default: null,
  })
  dob: string;

  @Column({
    type: 'varchar',
    length: 14,
    default: null,
  })
  mobile: string;


  @Column({
    type: 'boolean',
    default: false,
  })
  is_admin_verified: boolean;

  @Column({
    type: 'varchar',
    default: null,
  })
  profile_picture: string;





  @ManyToOne(() => Status, (status) => status.id)
  status: Status;



  @ManyToMany(() => Roles, (roles) => roles.id, {
    cascade: true,
  })
  @JoinTable()
  roles: Roles[]


  @Column({
    type: "boolean",
    default: false
  })
  is_block: Boolean;

  @Column({
    type: 'timestamptz',
    default: null,
  })
  created_at: Date;

  @Column({
    type: 'timestamptz',
    default: null,
  })
  updated_at: Date;

  @Column({
    type: 'varchar',
    default: null,
  })
  hashRt: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
