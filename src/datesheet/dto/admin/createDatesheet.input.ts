import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { DatesheetType } from "src/datesheet/enum/datesheetType.enum";
import { Semester } from "src/datesheet/enum/semester.enum";

@InputType()
export class CreateDatesheetInput{
    @Field()
    @IsNotEmpty()
    subject:string

    @Field()
    @IsNotEmpty()
    subject_code:string

    @Field(()=>Int)
    @IsNotEmpty()
    year:number

    @Field()
    @IsNotEmpty()
    date:string

    @Field()
    @IsNotEmpty()
    time:string

    @Field()
    @IsNotEmpty()
    semester:Semester

    @Field()
    @IsNotEmpty()
    type : DatesheetType

    @Field()
    @IsNotEmpty()
    stream:string

    @Field()
    @IsNotEmpty()
    branch:string



}