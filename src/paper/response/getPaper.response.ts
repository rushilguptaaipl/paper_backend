import { plainToClass } from "class-transformer";

export class SubjectResponse{
    id:number
    subject:string
}

export class YearResponse{
    id:number;
    year:number
}

export class GetPaperResponse{
    id:number
    url:string
    subject:SubjectResponse
    year:YearResponse

    static decode(input:any){
      return  plainToClass(this,input)
    }
}