import { plainToClass } from 'class-transformer';

export class getStatus {
    id: number;
    name: string
}


export class GetCustomerGroupResponse {

    id: number;
    name: string;
    description: string;
    status: getStatus;

    static decode(input: any): GetCustomerGroupResponse[] {
        return plainToClass(this, [].concat(input));
    }

}

export class CustomerGroupResponse {
    id: number;
    name: string;
    description: string;
    status: getStatus;
}