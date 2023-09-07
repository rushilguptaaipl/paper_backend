import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetPaperInput{
@Field()
year:number;
@Field()
subject:string;
}