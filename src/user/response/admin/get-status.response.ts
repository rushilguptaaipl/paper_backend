import { plainToClass } from "class-transformer"

export class GetStatusResponse {

    id: number;
    name: string

    static decode(input: any): GetStatusResponse {
        return plainToClass(this, input);
      }
}