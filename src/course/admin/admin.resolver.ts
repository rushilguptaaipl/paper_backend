import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AdminCourseService } from "./admin.service";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { CreateCourseInput } from "../dto/admin/createCourse.input";

@Resolver()
export class AdminCourseResolver{
    constructor(private readonly courseService : AdminCourseService){}

    @Mutation(()=>BooleanMessage)
    async adminCreateCourse(@Args('createCourseInput')createCourseInput:CreateCourseInput){
        return this.courseService.adminCreateCourse(createCourseInput)
    }

}