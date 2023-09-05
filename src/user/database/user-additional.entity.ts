import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  BaseEntity,
  ManyToMany,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAdditionalInformation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'float',
    default: null,
  })
  overall_rating: number;

  @Column({
    nullable: false, type: "float", default: 0.0
  })
  total_credits: number;

  @Column({
    nullable: false, type: "float", default: 0.0
  })
  total_earnings: number;

  @Column({
    nullable: false, default: 0
  })
  flashcount: number;

  @OneToOne(() => User , {nullable : false})
  @JoinColumn()
  user: User;
}
