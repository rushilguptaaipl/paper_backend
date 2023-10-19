import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindCourseUniversityEntity{
    @Field({nullable:true})
    id:number
    @Field({nullable:true})
    name:string
    @Field({nullable:true})
    city:string
    @Field({nullable:true})
    state:string
}


@ObjectType()
export class FindCourseEntity{
    @Field({nullable:true})
    id:number
    @Field({nullable:true})
    stream:string
    @Field({nullable:true})
    branch:string
    @Field(()=>FindCourseUniversityEntity,{nullable:true})
    university:FindCourseUniversityEntity
}