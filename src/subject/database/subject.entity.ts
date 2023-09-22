import { Datesheet } from "src/datesheet/database/datesheet.entity";
import { PaperUpload } from "src/paper/database/paperUpload.entity";
import { BaseEntity, Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subject extends BaseEntity{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    subject : string

    @Column({nullable:true})
    subject_code : string

    @OneToMany(()=>PaperUpload,(paperupload)=>paperupload.id)
    paperUpload:PaperUpload

    @OneToMany(()=>Datesheet,(datesheet)=>datesheet.id)
    datesheet:Datesheet

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