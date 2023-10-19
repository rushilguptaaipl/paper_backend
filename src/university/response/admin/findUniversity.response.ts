import { plainToClass } from "class-transformer"

export class FindUniversityResponse{
    id:number
    name:string
    city:string
    state:string

    static decode(input :any){
        return plainToClass(this,input)
    }
}

