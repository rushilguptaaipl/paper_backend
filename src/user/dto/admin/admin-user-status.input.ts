import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class AdminUserStatusInput {

  @Field(() => Int )
  user_id: number;

  @Field(() => Int )
  status_id: number;

}
