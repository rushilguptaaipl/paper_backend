import { Expose, plainToClass, Transform } from "class-transformer";

export class RoleResponse{
    id: number
    name : string
    permissions: [string]
}

export class Status{
    id: string
    name : string
}

export class userAdditionalInformation{
    id: string
    total_credits : string
    overall_rating : string
    total_earnings: string
}

export class GetAdminProfileResponse {
    id: string;
    name: string
    email: string
    mobile: string
    country_code: string
    dob: string
    email_verified: number;
    is_admin_verified: boolean;
    created_at:Date;

    @Transform(({ value }) =>value)
     profile_picture : string;

    @Expose({ name: 'roles' })
    @Transform(({ value }) => [value[0]] || [])
    role : RoleResponse[]

    status: Status;
    userAdditionalInformation: userAdditionalInformation;

    static decode(input: any): GetAdminProfileResponse {
        return plainToClass(this, input);
      }
}
