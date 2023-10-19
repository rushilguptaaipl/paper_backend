import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FindUniversityEntity{
@Field()
id:number
@Field()
name:string
@Field({nullable:true})
city:string
@Field({nullable:true})
state:string
}
