import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export class CreateRoleInput{
    @Field()
    @IsNotEmpty()
    name: string;

    @Field({ nullable:true, defaultValue:false })
    is_admin: boolean;

    @Field(() => [String],{ nullable:true})
    permissions: string[];
}