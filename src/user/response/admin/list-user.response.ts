import { Expose, plainToClass, Transform, Type } from "class-transformer";

export class RoleResponse{
    id: number
    name : string
    permissions: [string]
}

export class getStatus{
    id: string
    name : string
}

export class userAdditionalInformation{
    id: string
    total_credits : string
    overall_rating : string
}


export class ListUserAdmin{

    id : string;
    name: string
    email: string
    mobile: string
    country_code: string
    dob: string
    email_verified: number;
    is_admin_verified: boolean;
    created_at: Date;

    @Transform(({ value }) =>value)
    profile_picture : string;

    @Expose({ name: 'roles' })
    role : RoleResponse[];

    status: getStatus;
    userAdditionalInformation: userAdditionalInformation;
}

export class GetListUserResponse {
    
    adminListUser: ListUserAdmin[];
    refetch: boolean;
    count: number;

    static decode(input: any ): GetListUserResponse {
        return plainToClass(this, input);
    }

}