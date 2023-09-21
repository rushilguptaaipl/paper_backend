import { Field, ObjectType } from '@nestjs/graphql';
import { UserRoles } from '../../../roles/entities/roles.entity';

@ObjectType()
export class Status {

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

}




@ObjectType()
export class AdminProfile {

  @Field({ nullable: true })
  id: string;

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
  created_at: Date;

  @Field(() => [UserRoles], { nullable: true })
  role: UserRoles[];

  @Field(() => Status, { nullable: true })
  status: Status;



}
