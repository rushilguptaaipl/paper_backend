import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, Min } from "class-validator";

@InputType()
export class ListCourseInput{
    @Field()
    @IsNotEmpty()
    skip:number

    @Field()
    @IsNotEmpty()
    @Min(1)
    take:number
}