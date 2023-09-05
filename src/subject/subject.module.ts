import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectResolver } from './subject.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './database/subject.entity';
import { AdminSubjectResolver } from './admin/admin.resolver';
import { AdminSubjectService } from './admin/admin-subject.service';


@Module({
  imports:[TypeOrmModule.forFeature([Subject])],
  providers: [SubjectService, SubjectResolver,AdminSubjectResolver,AdminSubjectService]
})
export class SubjectModule {}
