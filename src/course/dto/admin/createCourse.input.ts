import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateCourseInput{
    @Field()
    @IsNotEmpty()
    stream : string

    @Field()
    @IsNotEmpty()
    branch : string
}