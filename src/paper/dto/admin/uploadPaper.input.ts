import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@InputType()
export class UploadpaperInput{
    // @Field({nullable:true})
    // // @IsNotEmpty()
    // subject : string

    // @Field({nullable:true})
    // // @IsNotEmpty()
    // year : number

    @Field(() => GraphQLUpload)
    file: Promise<FileUpload>;

}