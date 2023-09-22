import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCourseInput } from "../dto/admin/createCourse.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../database/admin/course.entity";
import { Repository } from "typeorm";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";

@Injectable()
export class AdminCourseService {

    constructor(@InjectRepository(Course) private readonly courseRepository: Repository<Course>) { }

    async adminCreateCourse(createCourseInput: CreateCourseInput) {
        const isExist = await this.courseRepository.findOne({ where: { stream: createCourseInput.stream, branch: createCourseInput.branch } })
        if (isExist) {
            throw new BadRequestException("Already exist");
        }
        await this.courseRepository.save(createCourseInput)
        const response = new BooleanMessage()
        response.success = true
        response.message = "created"
        return response
    }
}