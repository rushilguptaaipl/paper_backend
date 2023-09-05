import { Field, InputType } from "@nestjs/graphql";
import { Platform } from "../enum/platform.enum";

@InputType()
export class logoutInput {
@Field({nullable: true})
device_id : string;

@Field({nullable: true})
device_token : string;

@Field(type => Platform , {nullable: true})
platform : Platform;
}