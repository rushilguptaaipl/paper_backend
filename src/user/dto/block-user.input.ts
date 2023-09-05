import { Field, InputType, Int } from "@nestjs/graphql";


@InputType()
export class BlockedUserInput {
    @Field(()=>Int , {description:"User id to block"})
    user_id: number;

    @Field(()=>Int , {description:"Request id"})
    request_id: number;

}