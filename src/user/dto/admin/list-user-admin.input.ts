import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ListUserInput {
  @Field(() => Int, { description: 'Record to show per page' })
  take: number;

  @Field(() => Int, { description: 'Index to show next records' })
  skip: number;

  @Field(() => Int , {nullable:true})
  role_id: number

  @Field({nullable : true})
  search: string;

  @Field({nullable:true})
  refetch: boolean;
}