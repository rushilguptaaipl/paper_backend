import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('uploadPaper')
  @Render('uploadPaper')
  renderPaperUpload(){}

  @Get('addyear')
  @Render('addYear')
  renderAddYear(){}

  @Get('addUniversity')
  @Render('addUniversity')
  renderAddUniversity(){}
}
