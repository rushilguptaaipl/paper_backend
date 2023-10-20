import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AdminUploadPaperService } from './admin.service';
import { UploadpaperInputApi } from "../dto/admin/uploadPaperApi.input";

@Controller()
export class AdminUploadPaperController {
    constructor(private readonly adminUploadPaperService:AdminUploadPaperService){}
    @Post("file")
    @UseInterceptors(FileInterceptor('file'))
    async adminUploadPaper(@UploadedFile()file:Express.Multer.File , @Body() type:UploadpaperInputApi) {
        console.log("hello");
        
       return await this.adminUploadPaperService.adminUploadPaper(type,file)
    }
}