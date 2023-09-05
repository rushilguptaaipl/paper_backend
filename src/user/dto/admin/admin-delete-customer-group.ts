import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class DeleteCustomerGroupInput {
  @Field(() => Int)
  customerGroupId: number;
}
