import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { CheckUserBy } from "../enum/checkUserBy.enum";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

registerEnumType(CheckUserBy, {
    name: "CheckUserBy"
})
@InputType()
export class CheckUserInput {
    @Field(() => CheckUserBy)
    checkUserBy: CheckUserBy;

    @Field({ nullable: true })
    @IsEmail({}, { message: 'This email address is not valid' })
    @IsOptional()
    email: string;

    @Field({ nullable: true })
    country_code: string;

    @Field({ nullable: true })
    @IsString()
    @MaxLength(15)
    @MinLength(7)
    @IsOptional()
    mobile: string;

    @Field({ nullable: true })
    socialId: string;
}