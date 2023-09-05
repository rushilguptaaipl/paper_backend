import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class AdminGetUserProfileInput {
  @Field(() => Int , {nullable:false})
  user_id: number;
}