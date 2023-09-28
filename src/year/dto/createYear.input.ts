import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateYearInput{
    @Field(()=>Int)
    @IsNotEmpty()
    year:number;
}