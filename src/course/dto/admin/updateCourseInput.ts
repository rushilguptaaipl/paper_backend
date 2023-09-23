import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateCourseInput{

    @Field(()=>Int)
    @IsNotEmpty()
    id:number

    @Field()
    stream : string

    @Field()
    branch : string

    @Field()
    university:string
}