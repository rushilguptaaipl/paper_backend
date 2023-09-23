import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Semester } from "../enum/semester.enum";
import { DatesheetType } from "../enum/datesheetType.enum";

@ObjectType()
export class SubjectEntity{
    @Field(()=>Int,{nullable:true})
    id:number

    @Field({nullable:true})
    subject:string

    @Field({nullable:true})
    subject_code:string
}

@ObjectType()
export class YearEntity{
    @Field({nullable:true})
    id:number

    @Field({nullable:true})
    year:number
}

@ObjectType()
export class CourseEntity{
    @Field({nullable:true})
    id:number

    @Field({nullable:true})
    stream:string

    @Field({nullable:true})
    branch:string
}

@ObjectType()
export class DatesheetEntity
{
    @Field(()=>Int,{nullable:true})
    id: number

    @Field(()=>SubjectEntity,{nullable:true})
    subject:SubjectEntity

    @Field(()=>YearEntity,{nullable:true})
    year:YearEntity

    @Field(()=>CourseEntity,{nullable:true})
    course:CourseEntity

    @Field({nullable:true})
    date:string
    
    @Field({nullable:true})
    time:string

    @Field(()=>Semester,{nullable:true})
    semester:Semester

    @Field(()=>DatesheetType, {nullable:true})
    type:DatesheetType
}

@ObjectType()
export class GetDatesheetEntity{
    @Field(()=>[DatesheetEntity],{nullable:true})
    datesheet  : DatesheetEntity[]
}