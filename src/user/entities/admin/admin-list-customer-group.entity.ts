import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class getGroupStatus {
    @Field(() => Int)
    id: number;

    @Field({ nullable: true })
    name: string;
}

@ObjectType()
export class ListCustomerGroup {

    @Field(() => Int)
    id: number;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    status: getGroupStatus;

}