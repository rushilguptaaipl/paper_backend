import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserRoles } from '../../roles/entities/roles.entity'

@ObjectType()
export class AuthStatus {

  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;
}
@ObjectType()
export class GetSchool {

  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  status: AuthStatus;

}
@ObjectType()
export class UserAdditional {

  @Field(() => GetSchool, { nullable: true })
  school: GetSchool;

  @Field({ nullable: true })
  flashcount: number;
}

@ObjectType()
export class UserRegister {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  mobile: string;

  @Field({ nullable: true })
  country_code: string;

  @Field({ nullable: true })
  dob: string;

  @Field({ nullable: true })
  email_verified: number;

  @Field({ nullable: true })
  is_admin_verified: boolean;

  @Field({ nullable: true })
  profile_picture: string;

  @Field({ nullable: true })
  referral_code: string;

  @Field(() => [UserRoles], { nullable: true })
  role: UserRoles[];

  @Field(() => UserAdditional, { nullable: true })
  userAdditionalInformation: UserAdditional;

  @Field({ nullable: true })
  access_token: string;

  @Field({ nullable: true })
  refresh_token: string;
}
