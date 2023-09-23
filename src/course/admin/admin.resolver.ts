import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdminCourseService } from "./admin.service";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { CreateCourseInput } from "../dto/admin/createCourse.input";
import { UpdateCourseInput } from "../dto/admin/updateCourseInput";
import { GetCourseEntity, GetCourseResultEntity } from '../entities/admin/getCourse.entity';
import { ListCourseInput } from "../dto/admin/listCourse.input";

@Resolver()
export class AdminCourseResolver{
    constructor(private readonly courseService : AdminCourseService){}

    @Mutation(()=>BooleanMessage)
    async adminCreateCourse(@Args('createCourseInput')createCourseInput:CreateCourseInput){
        return this.courseService.adminCreateCourse(createCourseInput)
    }

    @Mutation(()=>BooleanMessage)
    async adminUpdateCourse(@Args('updateCourseInput')updateCourseInput:UpdateCourseInput){
        return this.courseService.adminUpdateCourse(updateCourseInput)
    }

    @Query(()=>GetCourseResultEntity)
    async adminListCourse(@Args('listCourseInput') listcourseInput:ListCourseInput){
        return await this.courseService.adminListCourse(listcourseInput)
       
        
    }

}