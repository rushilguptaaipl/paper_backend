import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProfilePictureUpload {
    @Field()
    success: boolean;
    
    @Field()
    message: string;

    @Field()
    url: string;
}