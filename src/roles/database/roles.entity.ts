import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    DeleteDateColumn,
  } from 'typeorm';


  
  @Entity()
  export class Roles extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      type: 'varchar',
      length: 100,
      default: null,
    })
    name: string;

    @Column({
      type: 'boolean',
      default: false,
      nullable: true
    })
    is_admin: boolean;

    @Column({
      type: 'boolean',
      default: false,
      nullable: true
    })
    is_super_admin: boolean;
    
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

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column('jsonb', { nullable: true })
    permissions: string[];
  }
  