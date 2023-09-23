import { plainToClass } from "class-transformer"

export class GetUniversityResponse{
    id:string
    name:string
    city:string
    stata:string
}


export class GetCourse{
    id:number
    stream:string
    branch:string
    university:GetUniversityResponse[]
}


export class GetCourseResponse{
    course : GetCourse[]
    count:number

    static decode(input:any) :GetCourseResponse{
        return plainToClass(this,input)
    }
}