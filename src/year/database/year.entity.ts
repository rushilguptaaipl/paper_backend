import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Year {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    year: number;

    @Column({
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    created_at: Date;

    @Column({
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    updated_at: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}