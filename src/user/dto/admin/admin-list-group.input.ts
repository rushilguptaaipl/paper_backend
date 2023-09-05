import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class ListCustomerGroupInput {
    @Field(() => Int, { description: 'Record to show per page' })
    @Min(1)
    take: number;

    @Field(() => Int, { description: 'Index to show next records' })
    skip: number;
}
