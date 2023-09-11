import { Module } from '@nestjs/common';
import { PaperResolver } from './paper.resolver';
import { PaperService } from './paper.service';
import { AdminUploadPaperResolver } from './admin/admin.resolver';
import { AdminUploadPaperService } from './admin/admin.service';
import { ImageUploadLib } from 'src/libs/image-upload.lib';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Year } from 'src/year/database/year.entity';
import { PaperUpload } from './database/paperUpload.entity';
import { Subject } from 'src/subject/database/subject.entity';
import { University } from 'src/university/database/university.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Subject,Year,PaperUpload,University])],
  providers: [PaperResolver, PaperService,AdminUploadPaperService,AdminUploadPaperResolver,ImageUploadLib]
})
export class PaperModule {}
