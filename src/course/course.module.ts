import { Module } from '@nestjs/common';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.service';
import { AdminCourseService } from './admin/admin.service';
import { AdminCourseResolver } from './admin/admin.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './database/admin/course.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Course])],
  providers: [CourseResolver, CourseService,AdminCourseService,AdminCourseResolver]
})
export class CourseModule {}
