import { Module } from '@nestjs/common';
import { DatesheetResolver } from './datesheet.resolver';
import { DatesheetService } from './datesheet.service';
import { DatesheetController } from './datesheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datesheet } from './database/datesheet.entity';
import { Year } from 'src/year/database/year.entity';
import { Subject } from 'src/subject/database/subject.entity';
import { AdminDatesheetService } from './admin/admin.service';
import { AdminDatesheetResolver } from './admin/admin.resolver';
import { Course } from 'src/course/database/admin/course.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Datesheet,Year,Subject,Course])],
  providers: [DatesheetResolver, DatesheetService,AdminDatesheetService,AdminDatesheetResolver],
  controllers: [DatesheetController]
})
export class DatesheetModule {}
