import { Field, ObjectType } from '@nestjs/graphql';
import { OverAllRating } from './overAll-rating.entity';
import { UserRoles } from '../../roles/entities/roles.entity';

@ObjectType()
export class CustomerGroup {

  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;

}
@ObjectType()
export class CheckStatus {

  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;

}
@ObjectType()
export class getSchool {

  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  status: CheckStatus;

}
@ObjectType()
export class GetUserAdditional {

  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  overall_rating: number;

  @Field({ nullable: true })
  total_credits: number;

  @Field({ nullable: true })
  flashcount: number;

  @Field(() => getSchool, { nullable: true })
  school: getSchool;
}

@ObjectType()
export class Profile {
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

  @Field(() => GetUserAdditional, { nullable: true })
  userAdditionalInformation: GetUserAdditional;

  @Field(() => CustomerGroup, { nullable: true })
  customerGroup: CustomerGroup;
}
