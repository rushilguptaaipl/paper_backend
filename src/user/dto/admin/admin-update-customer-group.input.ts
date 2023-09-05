import { InputType, Field, Int } from '@nestjs/graphql';
import { CustomerGroupInput } from './admin-customer-group.input';

@InputType()
export class UpdateCustomerGroupInput extends CustomerGroupInput {
  @Field(() => Int)
  id: number;
}
