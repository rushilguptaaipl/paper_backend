import { Datesheet } from "src/datesheet/database/datesheet.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    stream: string
    @Column()
    branch: string
    @OneToMany(() => Datesheet, (datesheet) => datesheet.id)
    datesheet: Datesheet
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