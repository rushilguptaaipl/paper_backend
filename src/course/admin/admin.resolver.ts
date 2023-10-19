import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdminCourseService } from "./admin.service";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { CreateCourseInput } from "../dto/admin/createCourse.input";
import { UpdateCourseInput } from "../dto/admin/updateCourseInput";
import { GetCourseResultEntity } from '../entities/admin/getCourse.entity';
import { ListCourseInput } from "../dto/admin/listCourse.input";
import { DeleteCourseInput } from "../dto/admin/deleteCourse.input";
import { FindCourseInput } from "../dto/admin/findCourse.input";
import { FindCourseEntity } from "../entities/admin/findCourse.entity";

@Resolver()
export class AdminCourseResolver {
    constructor(private readonly courseService: AdminCourseService) { }

    @Mutation(() => BooleanMessage)
    async adminCreateCourse(@Args('createCourseInput') createCourseInput: CreateCourseInput) {
        return this.courseService.adminCreateCourse(createCourseInput)
    }

    @Mutation(() => BooleanMessage)
    async adminUpdateCourse(@Args('updateCourseInput') updateCourseInput: UpdateCourseInput) {
        return this.courseService.adminUpdateCourse(updateCourseInput)
    }

    @Query(() => GetCourseResultEntity)
    async adminListCourse() {
        return await this.courseService.adminListCourse()
    }

    @Mutation(() => BooleanMessage)
    async adminDeleteCourse(@Args('deleteCourseInput') deletecourseInput: DeleteCourseInput) {
        await this.courseService.adminDeleteCourse(deletecourseInput)
    }

    @Query(()=>FindCourseEntity)
    async adminFindCourse(@Args('findCourseInput') findCourseInput:FindCourseInput ){
          return await this.courseService.adminFindCourse(findCourseInput)
    }
}