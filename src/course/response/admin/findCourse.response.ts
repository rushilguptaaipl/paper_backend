import { plainToClass } from "class-transformer"

export class FindCourseUniversityResponse{
    id:string
    name:string
    city:string
    stata:string
}


export class FindCourseResponse{
    id:number
    stream:string
    branch:string
    university:FindCourseUniversityResponse

    static decode(input:any) :FindCourseResponse{
        return plainToClass(this,input)
    }
}
