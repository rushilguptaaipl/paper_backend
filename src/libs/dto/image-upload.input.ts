import { Field, InputType } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@InputType()
export class ImageUploadInput {
    @Field(() => GraphQLUpload)
    image: Promise<FileUpload>;
}