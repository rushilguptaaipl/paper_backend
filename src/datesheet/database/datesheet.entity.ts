import { Subject } from "src/subject/database/subject.entity";
import { Year } from "src/year/database/year.entity";
import { BaseEntity, Column, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Semester } from "../enum/semester.enum";
import { Course } from "src/course/database/admin/course.entity";
import { DatesheetType } from "../enum/datesheetType.enum";

@Entity()
export class Datesheet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id; number
    @ManyToOne(() => Subject, (subject) => subject.id)
    subject: Subject
    @ManyToOne(() => Year, (year) => year.id)
    year: Year
    @ManyToOne(() => Course, (course) => course.id)
    course: Course
    @Column()
    date: string
    @Column()
    time: string
    @Column({type:"enum",enum:DatesheetType,default:null,nullable:true})
    type:DatesheetType
    @Column({
        type: "enum",
        enum: Semester,
        default: null
    })
    semester: Semester
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