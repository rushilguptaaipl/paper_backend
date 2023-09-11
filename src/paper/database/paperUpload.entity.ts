import { Subject } from "src/subject/database/subject.entity";
import { University } from "src/university/database/university.entity";
import { Year } from "src/year/database/year.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaperUpload {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(() => Year, (year) => year.id)
    year: Year

    @ManyToOne(() => Subject, (subject) => subject.id)
    subject: Subject

    @ManyToOne(()=>University , (university)=>university.id)
    university : University

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