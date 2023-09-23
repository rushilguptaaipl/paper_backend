import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class GetUniversityEntity{
    @Field()
    id:number
    @Field()
    name:string
    @Field()
    city:string
    @Field()
    state:string
}


@ObjectType()
export class GetCourseEntity{
    @Field()
    id:number
    @Field()
    stream:string
    @Field()
    branch:string
    @Field(()=>GetUniversityEntity)
    university:GetUniversityEntity
}

@ObjectType()
export class GetCourseResultEntity{
    @Field(()=>[GetCourseEntity],{nullable:true})
    course:GetCourseEntity[]
    @Field()
    count:number
}