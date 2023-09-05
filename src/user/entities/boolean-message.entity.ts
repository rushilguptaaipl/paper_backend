import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BooleanMessage {
    @Field()
    success: boolean;
    
    @Field()
    message: string;
}