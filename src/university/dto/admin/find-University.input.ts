import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class FindUniversityInput{
    @Field()
    @IsNotEmpty()
    id:number
}