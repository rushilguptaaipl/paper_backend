import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OverAllRating {
  @Field({ nullable: true })
  overall_rating: number;
}
