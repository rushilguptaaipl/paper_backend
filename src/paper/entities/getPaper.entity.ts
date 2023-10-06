import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SubjectGetPaper{
    @Field()
    id:number
    @Field()
    subject :string
}

@ObjectType()
export class YearGetPaper{
    @Field()
    id:number
    @Field()
    year :number
}

@ObjectType()
export class UniversityGetPaper{
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
export class GetPaper{
    @Field()
    id:number
    @Field()
    url : string
    @Field()
    subject:SubjectGetPaper
    @Field()
    year:YearGetPaper
    @Field()
    university : UniversityGetPaper
}