import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { SendOtpOn } from "../enum/send-otp-on.enum";

registerEnumType(SendOtpOn, {
    name: 'SendOtpOn',
});
@InputType()
export class VerifyOtpInput {
    @Field(() => SendOtpOn)
    sendOtp_on: SendOtpOn;

    @Field({nullable:true})
    @IsEmail({}, { message: 'This email address is not valid' })
    @IsOptional()
    email: string;
    
    @Field({nullable: true})
    country_code: string;

    @Field({nullable: true})
    mobile: string;

    @Field()
    @IsNumber()
    @IsNotEmpty({message:"Please provide the code"})
    code: number;
}