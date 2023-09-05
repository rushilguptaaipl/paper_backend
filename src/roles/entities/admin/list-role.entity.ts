import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ListRole {
    @Field(() => Int, { nullable: true })
    id: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    is_admin: boolean;

    @Field({ nullable: true })
    is_super_admin: boolean;

    @Field(() => [String],{ nullable:true })
    permissions: string[];

    @Field({ nullable: true })
    created_at: Date;

}

@ObjectType()
export class RolesListAdmin {

    @Field(() => [ListRole], { nullable: true })
    adminListRoles: ListRole[];

}