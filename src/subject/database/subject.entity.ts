import { PaperUpload } from "src/paper/database/paperUpload.entity";
import { BaseEntity, Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subject extends BaseEntity{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    subject : string

    @OneToMany(()=>PaperUpload,(paperupload)=>paperupload.id)
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