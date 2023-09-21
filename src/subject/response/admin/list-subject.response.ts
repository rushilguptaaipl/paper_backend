import { plainToClass } from "class-transformer";



export class ListSubject{
    id:number
    subject:string
    subject_code:string
}

export class ListSubjectResponse{

    subject : ListSubject[]


    static decode(input: any): ListSubjectResponse {
        return plainToClass(this,input);
    }
}