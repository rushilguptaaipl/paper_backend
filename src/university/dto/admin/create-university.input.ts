import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class CreateUniversityInput{
    @Field()
    name:string
    @Field()
    state:string
    @Field()
    city:string
}