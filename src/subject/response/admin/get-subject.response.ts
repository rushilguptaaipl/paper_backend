import { plainToClass } from "class-transformer";



export class GetSubjectResponse{
    id:number
   subject : string

    static decode(input: any): GetSubjectResponse {
        return plainToClass(this,input);
    }
}