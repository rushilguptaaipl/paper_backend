import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ListUniversityEntity{
@Field()
id:number
@Field()
name:string
@Field({nullable:true})
city:string
@Field({nullable:true})
state:string
}


@ObjectType()
export class ListUniversitiesEntity{
    @Field(()=>[ListUniversityEntity])
    universities : ListUniversityEntity[]
}