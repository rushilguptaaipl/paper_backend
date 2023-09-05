import { plainToClass, Type } from "class-transformer";

export class ListRole{
    id: number;
    name: string;
    is_admin: boolean;
    is_super_admin: boolean;
    permissions:string[];
    created_at: Date;
}

export class GetRolesListResponse {
    @Type(() => ListRole)
    adminListRoles: ListRole[];

    static decode(input: any ): GetRolesListResponse {   
        return plainToClass(this, input);
    }

}