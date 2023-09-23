import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { Semester } from "../enum/semester.enum";
import { Type } from '@nestjs/common';
import { DatesheetType } from "../enum/datesheetType.enum";

@InputType()
export class GetDatesheetInput{
    @Field()
    @IsNotEmpty()
    semester:Semester

    @Field(()=>Int)
    @IsNotEmpty()
    year:number

    @Field()
    @IsNotEmpty()
    stream:string

    @Field()
    @IsNotEmpty()
    branch : string

    @Field()
    @IsNotEmpty()
    type:DatesheetType
}