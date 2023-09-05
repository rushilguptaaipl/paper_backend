import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { SendOtpOn } from '../enum/send-otp-on.enum';

registerEnumType(SendOtpOn, {
    name: 'SendOtpOn',
});
@InputType()
export class LoginWithMobileOrEmailInput {
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
}
