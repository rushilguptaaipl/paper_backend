import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { SendOtpOn } from "../enum/send-otp-on.enum";

registerEnumType(SendOtpOn, {
    name: "SendOtpOn"
})
@InputType()
export class IsBlockInput {
    @Field(() => SendOtpOn)
    CheckBlockBy: SendOtpOn;

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
 
}