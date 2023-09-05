import { Field, InputType } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@InputType()
export class ProfilePictureUploadInput {
    @Field(() => GraphQLUpload)
    image: Promise<FileUpload>;
}