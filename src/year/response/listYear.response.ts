import { plainToClass } from "class-transformer";

export class ListYear{
    id:number
    year:number
}

export class ListYearResponse{

    year : ListYear[]

    static decode(input : any):ListYearResponse{
        return plainToClass(this,input)
    }
}