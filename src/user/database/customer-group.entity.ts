import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
    DeleteDateColumn
} from 'typeorm';
import { Status } from './status.entity';

@Entity()
export class CustomerGroup extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
        default: null,
    })
    name: string;

    @Column({
        default: null,
    })
    description: string;

    @Column({
        default: null,
    })
    sort_order: number;

    @ManyToOne(() => Status, (status) => status.id)
    status: Status;

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
}
