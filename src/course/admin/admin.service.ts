import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCourseInput } from "../dto/admin/createCourse.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../database/admin/course.entity";
import { Repository } from "typeorm";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { University } from "src/university/database/university.entity";
import { UpdateCourseInput } from "../dto/admin/updateCourseInput";
import { NotFoundError } from "rxjs";
import { GetCourseResponse } from "../response/admin/getCourse.response";
import { ListCourseInput } from "../dto/admin/listCourse.input";

@Injectable()
export class AdminCourseService {

    constructor(@InjectRepository(Course) private readonly courseRepository: Repository<Course>,
        @InjectRepository(University) private readonly universityRepository: Repository<University>) { }

    async adminCreateCourse(createCourseInput: CreateCourseInput) {
        const isExist = await this.courseRepository.findOne({ where: { university: { name: createCourseInput.university }, stream: createCourseInput.stream, branch: createCourseInput.branch }, relations: { university: true } })
        if (isExist) {
            throw new BadRequestException("COURSE Already exist");
        }
        const university = await this.universityRepository.findOne({ where: { name: createCourseInput.university } })

        if(!university){
            throw new NotFoundException("university not found")
        }

        const course = new Course();
        course.stream = createCourseInput.stream;
        course.branch = createCourseInput.branch;
        course.university = university;
        course.created_at = new Date(Date.now());
        course.updated_at = new Date(Date.now());


        await this.courseRepository.save(course)
        const response = new BooleanMessage()
        response.success = true
        response.message = "created"
        return response
    }

    async adminUpdateCourse(updateCourseInput: UpdateCourseInput) {

        const course = await this.courseRepository.findOne({ where: { id: updateCourseInput.id } })

        if (updateCourseInput?.university) {
            var university = await this.universityRepository.findOne({ where: { name: updateCourseInput.university } })
            course.university = university;
        }

        course.branch = updateCourseInput?.branch;
        course.stream = updateCourseInput?.stream;
        course.updated_at = new Date(Date.now());

        await this.courseRepository.update(updateCourseInput.id,course);

        const response = new BooleanMessage()
        response.success = true
        response.message = "updated"
        return response
    }

    async adminListCourse(listcourseInput:ListCourseInput){
        const [course,count] = await this.courseRepository.findAndCount({relations:{university:true},skip:listcourseInput.skip ,take:listcourseInput.take});
        if(!course.length){
            throw new NotFoundException("add a course")
        }
      const result  = {course:course , count:count}
        return GetCourseResponse.decode(result)
    }
}