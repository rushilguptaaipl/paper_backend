import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Platform } from "../enum/platform.enum";
import { SendOtpOn } from "../enum/send-otp-on.enum";

registerEnumType(Platform, {
    name: 'Platform',
});
registerEnumType(SendOtpOn, {
    name: 'SendOtpOn',
});
@InputType()
export class LoginWithOtpInput {
    @Field(() => SendOtpOn)
    login_type: SendOtpOn;

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

    @Field(() => Int)
    @IsNotEmpty({ message: 'Please provide OTP' })
    OTP: number;

    @Field({ nullable: true })
    device_id: string;

    @Field({ nullable: true })
    device_token: string;

    @Field(type => Platform, { nullable: true })
    platform: Platform;
}