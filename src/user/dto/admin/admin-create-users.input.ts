import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { DateFormat } from 'src/user/validation/dateTime-validation';
import { IsEmailAlreadyExist } from 'src/user/validation/email-validation';

@InputType()
export class AdminCreateUserInput {
  @Field()
  @IsNotEmpty()
  @Matches(/^[A-z]*$|^[A-z]+\s[A-z]*$/, { message: 'Name contains invalid characters' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'This email address is not valid' })
  @IsNotEmpty({ message: 'Please provide email' })
  @IsEmailAlreadyExist({ message: 'email already registered' })
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, { message: 'Choose a stronger password' })
  password: string;

  @Field({ nullable: true })
  mobile: string;

  @Field({ nullable: true })
  country_code: string;

  @Field({ nullable: true })
  @DateFormat({ message: "The date is invalid. Please enter a date in the format yyyy-mm-dd" })
  dob: string;

  @Field(() => [Int])
  @IsNotEmpty()
  role: number[];

  @Field(() => Int)
  @IsNotEmpty()
  status: number;
}