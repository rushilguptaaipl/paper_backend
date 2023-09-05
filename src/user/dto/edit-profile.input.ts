import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional, Matches } from "class-validator";
import { DateResolver } from "graphql-scalars";

@InputType()
export class EditProfileInput {
    @Field({nullable: true})
    @IsOptional()
    @Matches(/^[A-z]*$|^[A-z]+\s[A-z]*$/, {message: 'Name contains invalid characters'})
    name: string;

    @Field({nullable: true})
    mobile: string;

    @Field({nullable: true})
    country_code: string;

    @Field(()=>DateResolver,{nullable: true})
    @IsOptional()
    dob: string;

    @Field(()=> Int, {nullable: true})
    school: number;
}