import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty , IsDateString , IsOptional , IsDate} from 'class-validator';
import { Platform } from '../enum/platform.enum';

registerEnumType(Platform, {
  name: 'Platform',
});
@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'This email address is not valid' })
  @IsNotEmpty({ message: 'Please provide email' })
  username: string;
  
  @Field()
  @IsNotEmpty()
  password: string;

  @Field({nullable: true})
  role: number;

  @Field({nullable: true})
  device_id : string;

  @Field({nullable: true})
  device_token : string;

  @Field(type => Platform , {nullable: true})
  platform : Platform;
 
}
