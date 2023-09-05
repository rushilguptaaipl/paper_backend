import { plainToClass, Transform } from "class-transformer";



export class GetRoleResponse {
    id: number;
    name: string;
    is_admin: boolean;
    is_super_admin: boolean;
    permissions: [string];
    created_at: Date;

    static decode(input: any ): GetRoleResponse {
        return plainToClass(this, input);
    }
}