import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn, DeleteDateColumn
} from 'typeorm';

import { Status } from "./status.entity";
import { Roles } from "../../roles/database/roles.entity";

import { UserAdditionalInformation } from './user-additional.entity';
import { CustomerGroup } from './customer-group.entity';


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
    type: 'varchar',
    length: 4,
    default: null,
  })
  country_code: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 10,
    default: null,
  })
  referral_code: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: null,
  })
  referral_code_used: string;

  @Column({
    type: 'timestamptz',
    default: null,
  })
  email_verified_at: Date;

  @Column({
    type: 'smallint',
    default: 0,
  })
  is_verified: number;

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

  @Column({
    type: 'varchar',
    default: null,
    length: 150,
  })
  stripe_connect_id: string;

  @Column({
    type: 'varchar',
    default: null,
    length: 150,
  })
  stripe_customer_id: string;

  @ManyToOne(() => Status, (status) => status.id)
  status: Status;

  @OneToOne(() => UserAdditionalInformation, (userAdditionalInformation) => userAdditionalInformation.user)
  userAdditionalInformation: UserAdditionalInformation

  @ManyToMany(() => Roles, (roles) => roles.id, {
    cascade: true,
  })
  @JoinTable()
  roles: Roles[]


  @ManyToOne(() => CustomerGroup, (customerGroup) => customerGroup.id)
  customerGroup: CustomerGroup;

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
