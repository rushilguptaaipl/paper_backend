import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AdminUploadPaperService } from "./admin.service";
import { UploadpaperInput } from "../dto/admin/uploadPaper.input";
import { BooleanMessage } from "src/user/entities/boolean-message.entity";
import { CurrentUser } from "src/user/user.decorator";

@Resolver()
export class AdminUploadPaperResolver{
    constructor(private readonly uploadPaperService:AdminUploadPaperService){}
@Mutation(()=>BooleanMessage)
adminUploadPaper(@Args('uploadPaperInput') uploadPaperInput:UploadpaperInput){
  const user = null
    return this.uploadPaperService.adminUploadPaper(uploadPaperInput , user)
}
}