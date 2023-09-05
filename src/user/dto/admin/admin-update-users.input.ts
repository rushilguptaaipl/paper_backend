import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateUserInput } from '../create-user.input';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { IsEmailAlreadyExist } from 'src/user/validation/email-validation';
import { DateFormat } from 'src/user/validation/dateTime-validation';

@InputType()
export class AdminUpdateUserInput {
    @Field(() => Int)
    user_id: number;

    @Field()
    @IsNotEmpty()
    @Matches(/^[A-z]*$|^[A-z]+\s[A-z]*$/, { message: 'Name contains invalid characters' })
    name: string;

    @Field({ nullable: true })
    mobile: string;

    @Field({ nullable: true })
    country_code: string;

    @Field({ nullable: true })
    @DateFormat({ message: "The date is invalid. Please enter a date in the format yyyy-mm-dd" })
    dob: string;

    @Field(() => Int)
    @IsNotEmpty()
    role: number;

    @Field({nullable: true})
    updated_at: Date

}