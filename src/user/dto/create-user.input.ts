import { InputType, Int, Field ,GraphQLISODateTime, registerEnumType} from '@nestjs/graphql';
import { IsEmail, IsNotEmpty , IsDateString , IsOptional , IsDate, Matches, MinLength} from 'class-validator';
import { DateResolver } from 'graphql-scalars';
import { DateFormat } from '../validation/dateTime-validation';
import { IsEmailAlreadyExist } from '../validation/email-validation';
import { Platform } from '../enum/platform.enum';

registerEnumType(Platform, {
  name: 'Platform',
});
@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @Matches(/^[A-z]*$|^[A-z]+\s[A-z]*$/, {message: 'Name contains invalid characters'})
  name: string;

  @Field()
  @IsEmail({}, { message: 'This email address is not valid' })
  @IsNotEmpty({ message: 'Please provide email' })
  @IsEmailAlreadyExist({message:'email already registered'})
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
 // @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {message: 'Choose a stronger password'})
  password: string;

  @Field({nullable: true})
  mobile: string;

  @Field({nullable: true})
  referral_code: string;

  @Field({nullable: true})
  country_code: string;

  @Field({nullable: true})
  is_verified: number;

  @Field({nullable: true})
  @DateFormat({message : "The date is invalid. Please enter a date in the format yyyy-mm-dd"})
  dob: string;

  @Field(()=>Int)
  @IsNotEmpty()
  role: number;

  @Field({nullable: true})
  device_id : string;

  @Field({nullable: true})
  device_token : string;

  @Field(type => Platform , {nullable: true})
  platform : Platform;
 
}
