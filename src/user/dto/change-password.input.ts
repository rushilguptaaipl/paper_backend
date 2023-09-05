import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

@InputType()
export class ChangePasswordInput {
    @Field()
    @IsNotEmpty({ message: 'Please provide old password' })
    oldPassword: string;

    @Field()
    @IsNotEmpty({message: 'New password should not be empty'})
    @MinLength(8 , {message: 'New password must be longer than or equal to 8 characters'})
    // @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {message: 'Choose a stronger password'})
    newPassword: string;
}