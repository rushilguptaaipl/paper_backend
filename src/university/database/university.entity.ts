import { Course } from "src/course/database/admin/course.entity";
import { PaperUpload } from "src/paper/database/paperUpload.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class University {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string;

  @Column({ nullable: true })
  state: string

  @Column({ nullable: true })
  city: string

  @OneToMany(()=>Course , (course)=> course.id)
  course : Course

  @OneToMany(() => PaperUpload, (paperUpload) => paperUpload.id)
  paperUpload: PaperUpload;

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