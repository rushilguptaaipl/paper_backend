import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty } from "class-validator";


@InputType()
export class CheckEmailExistsInput {
    @Field()
    @IsEmail({}, { message: 'This email address is not valid' })
    @IsNotEmpty({ message: 'Please provide email' })
    email: string;
}