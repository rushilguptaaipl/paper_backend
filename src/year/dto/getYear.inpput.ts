import { Field, InputType, PartialType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class GetYearInput {
    @Field()
    @IsNotEmpty()
    id:number

}