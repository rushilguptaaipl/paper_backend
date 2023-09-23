import { Controller, Post, UploadedFile } from '@nestjs/common';
import { AdminDatesheetService } from './admin/admin.service';
import { DatesheetService } from './datesheet.service';

@Controller('datesheet')
export class DatesheetController {

    constructor(private readonly datesheetService:DatesheetService){}

    @Post("upload")
    async uploadDatesheet(@UploadedFile() file:Express.Multer.File){
        return await this.datesheetService.uploadDatesheet(file)
    }

}
