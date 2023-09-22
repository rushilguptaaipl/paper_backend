import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { AdminDatesheetService } from "./admin.service";
import { CreateDatesheetInput } from "../dto/admin/createDatesheet.input";

@Resolver()
export class AdminDatesheetResolver{

constructor(private readonly adminDatesheetService:AdminDatesheetService){}

@Mutation(()=>BooleanMessage)
async adminCreateDatesheet(@Args('createDatesheetInput')createDatesheetInput:CreateDatesheetInput){
    return this.adminDatesheetService.adminCreateDatesheet(createDatesheetInput)
}
}