import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive } from 'class-validator';

@InputType()
export class CustomerGroupInput {

    @IsNotEmpty()
    @Field()
    name: string;

    @Field({ nullable: true })
    description: string;

    @Field(() => Int)
    status: number;

    @Field(() => Int)
    sort_order: number;
}