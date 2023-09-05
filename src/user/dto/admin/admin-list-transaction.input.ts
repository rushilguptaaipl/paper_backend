import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AdminListTransactionInput {
  @Field(() => Int, { description: 'Record to show per page' })
  take: number;

  @Field(() => Int, { description: 'Index to show next records' })
  skip: number;

  @Field({nullable : true})
  search: string;

  @Field({nullable:true})
  refetch: boolean;

}