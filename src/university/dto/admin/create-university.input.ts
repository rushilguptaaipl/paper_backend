import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class CreateUniversityInput{
    @Field()
    name:string
    @Field({nullable:true})
    state:string
    @Field({nullable:true})
    city:string
}