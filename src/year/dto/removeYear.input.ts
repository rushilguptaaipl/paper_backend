import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class RemoveYearInput{
@Field()
@IsNotEmpty()
id:number
}