import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateUniversityInput{
    @Field(()=>Int)
    @IsNotEmpty()
    id:number;
    @Field({nullable:true})
    name:string;
    @Field({nullable:true})
    city:string;
    @Field({nullable:true})
    state:string
}