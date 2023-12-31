import { Datesheet } from "src/datesheet/database/datesheet.entity";
import { PaperUpload } from "src/paper/database/paperUpload.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Year {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    year: number;

    @OneToMany(()=>Datesheet,(datesheet)=>datesheet.id)
    datesheet:Datesheet

    @OneToMany(()=>PaperUpload,(paperUpload)=> paperUpload.id)
    paperUpload:PaperUpload

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