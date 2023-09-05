import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ImageUploadEntity {
    @Field()
    success: boolean;
    
    @Field()
    message: string;

    @Field()
    url: string;
}