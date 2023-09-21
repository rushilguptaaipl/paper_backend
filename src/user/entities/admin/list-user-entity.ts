import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UserRoles } from "../../../roles/entities/roles.entity";

@ObjectType()
export class listStatus {

    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    name: string;

}



@ObjectType()
export class ListUserAdmin {

    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    mobile: string;

    @Field({ nullable: true })
    country_code: string;

    @Field({ nullable: true })
    dob: string;

    @Field({ nullable: true })
    email_verified: number;

    @Field({ nullable: true })
    is_admin_verified: boolean;

    @Field({ nullable: true })
    profile_picture: string;

    @Field({ nullable: true })
    created_at: Date;

    @Field(() => [UserRoles], { nullable: true })
    role: UserRoles[];

    @Field(() => listStatus, { nullable: true })
    status: listStatus;

}

@ObjectType()
export class UserAdmin {

    @Field(() => [ListUserAdmin], { nullable: true })
    adminListUser: ListUserAdmin[];

    @Field({ defaultValue : false })
    refetch: boolean;

    @Field(() => Int, { nullable: true })
    count: number;

}