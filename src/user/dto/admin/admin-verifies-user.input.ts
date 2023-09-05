import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class AdminVerifiesUserInput{
    @Field(() => Int )
    user_id: number;

    @Field()
    is_verified:boolean;
}