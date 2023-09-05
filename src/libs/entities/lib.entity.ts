import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Lib {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
