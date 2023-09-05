import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import { Tokens } from 'src/auth/types/tokens.type';

export class Status {
    id: number
    name: string;
}
export class getSchool {
    id: number
    name: string;
    status: Status;
}
export class GetUserAdditional {
    id: number
    overall_rating: number
    total_credits: number;
    school: getSchool;
    flashcount: number;
}
export class RoleResponse {
    id: number
    name: string
    permissions: [string]
}

export class CustomerGroup {
    id: number;
    name: string;
  }

export class GetProfileResponse {
    name: string
    email: string
    mobile: string
    country_code: string
    dob: string
    email_verified: number;
    is_admin_verified: boolean;
    referral_code: string
    customerGroup: CustomerGroup;

    @Transform(({ value }) => value)
    profile_picture: string;

    userAdditionalInformation: GetUserAdditional;
    @Expose({ name: 'roles' })
    @Transform(({ value }) => [value[0]] || [])
    role: RoleResponse[]


    static decode(input: any): GetProfileResponse {
        return plainToClass(this, input);
    }
}

export class AuthResponse {
    name: string
    email: string
    mobile: string
    country_code: string
    dob: string;
    referral_code: string;
    email_verified: number;
    is_admin_verified: boolean;
    access_token: string;
    @Expose({ name: 'hashRt' })
    refresh_token: string;

    @Transform(({ value }) => value)
    profile_picture: string;

    @Expose({ name: 'roles' })
    role: RoleResponse[]

    userAdditionalInformation: GetUserAdditional;

    static decode(input: any, tokens: Tokens): AuthResponse {
        const obj = plainToClass(this, input);
        obj.access_token = tokens.access_token;
        obj.refresh_token = tokens.refresh_token;
        return obj;
    }
}