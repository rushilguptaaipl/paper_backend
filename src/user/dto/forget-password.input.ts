import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { SendOtpOn } from "../enum/send-otp-on.enum";

registerEnumType(SendOtpOn,
    { name: "SendOtpOn" })
@InputType()
export class ForgetPasswordInput {
    @Field(() => SendOtpOn)
    findUserBy: SendOtpOn;

    @Field({ nullable: true })
    country_code: string;

    @Field({ nullable: true })
    @IsString()
    @MaxLength(15)
    @MinLength(7)
    @IsOptional()
    mobile: string;

    @Field({ nullable: true })
    @IsEmail({}, { message: 'This email address is not valid' })
    @IsNotEmpty({ message: 'Please provide email' })
    @IsOptional()
    email: string;

    @Field()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, { message: 'Choose a stronger password' })
    password: string;
}