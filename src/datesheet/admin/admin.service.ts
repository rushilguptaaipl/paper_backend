import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Datesheet } from "../database/datesheet.entity";
import { Repository } from "typeorm";
import { CreateDatesheetInput } from "../dto/admin/createDatesheet.input";
import { Year } from "src/year/database/year.entity";
import { Subject } from "src/subject/database/subject.entity";
import { threadId } from "worker_threads";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { Course } from "src/course/database/admin/course.entity";


@Injectable()
export class AdminDatesheetService {
    constructor(@InjectRepository(Datesheet) private readonly datesheetRepository: Repository<Datesheet>,
        @InjectRepository(Year) private readonly yearRepository: Repository<Year>,
        @InjectRepository(Subject) private readonly subjecttRepository: Repository<Subject>,
        @InjectRepository(Course) private readonly courseRepository : Repository<Course>
        ) { }

    async  adminCreateDatesheet(createDatesheetInput: CreateDatesheetInput) {
        const subject = await this.subjecttRepository.findOne({ where: { subject_code: createDatesheetInput.subject_code } })

        if (!subject) {
            throw new NotFoundException()
        }

        const year = await this.yearRepository.findOne({ where: { year: createDatesheetInput.year } })

        if (!year) {
            throw new NotFoundException()
        }

        const course = await this.courseRepository.findOne({where:{stream:createDatesheetInput.stream , branch:createDatesheetInput.branch}})

        const datesheet = new Datesheet()
        datesheet.subject= subject;
        datesheet.year =  year;
        datesheet.date = createDatesheetInput.date;
        datesheet.time =  createDatesheetInput.time;
        datesheet.course = course;
        datesheet.semester = createDatesheetInput.semester;
        datesheet.type = createDatesheetInput.type;
        datesheet.created_at = new Date(Date.now());
        datesheet.updated_at = new Date(Date.now());

        await this.datesheetRepository.save(datesheet)

        const response = new BooleanMessage()
        response.success = true;
        response.message = "datesheet added successfully";
        return response
    }

}