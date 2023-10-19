import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class FindCourseInput{
    @Field()
    @IsNotEmpty()
    id:number
}