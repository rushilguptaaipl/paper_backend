import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateSubjectInput } from "./createSubject.input";
import { IsNotEmpty } from "class-validator";

@InputType()
export class updateSubjectInput extends PartialType (CreateSubjectInput){
    @Field()
    @IsNotEmpty()
    id : number
}