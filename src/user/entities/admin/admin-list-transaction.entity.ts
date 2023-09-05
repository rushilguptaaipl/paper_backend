import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class GetStudentCreditHistory {

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

}

@ObjectType()
export class GetRequestType {

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

}

@ObjectType()
export class ListTransactionAdmin {

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  transaction_id: string;

  @Field({ nullable: true })
  credit_spent: string;

  @Field({ nullable: true })
  credit_purchased: string;

  @Field({ nullable: true })
  source: string;

  @Field({ nullable: true })
  created_at: Date;

  @Field(() => GetStudentCreditHistory, { nullable: true })
  student: GetStudentCreditHistory;

  @Field(() => GetRequestType, { nullable: true })
  request_type: GetRequestType;

}

@ObjectType()
export class AdminListTransaction {

  @Field(() => [ListTransactionAdmin], { nullable: true })
  listStudentTransactionHistory: ListTransactionAdmin[];

  @Field({ defaultValue : false })
  refetch: boolean;

  @Field(() => Int, { nullable: true })
  count: number;

}