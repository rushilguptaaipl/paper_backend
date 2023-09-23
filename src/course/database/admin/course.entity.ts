import { Datesheet } from "src/datesheet/database/datesheet.entity";
import { University } from "src/university/database/university.entity";
import { Column, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    stream: string
    @Column()
    branch: string
    @ManyToOne(()=>University, (university)=>university.id)
    university:University
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