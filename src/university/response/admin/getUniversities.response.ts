import { Strings } from "aws-sdk/clients/opsworks";
import { Type, plainToClass } from "class-transformer";


export class UniversityResponse{
    id:number
    name:string
    city:string
    state:string

    

    static decode(input :any){
        return plainToClass(this,input)
    }
}

export class GetUniversitiesResponse{

    
    universities : UniversityResponse[]

    static decode(input :any){
        return plainToClass(this,input)
    }
}