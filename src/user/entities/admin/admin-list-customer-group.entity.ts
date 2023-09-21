import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class getGroupStatus {
    @Field(() => Int)
    id: number;

    @Field({ nullable: true })
    name: string;
}

