import { Module } from '@nestjs/common';
import { UniversityResolver } from './university.resolver';
import { UniversityService } from './university.service';
import { AdminuniversityResolver } from './admin/admin.resolver';
import { AdminuniversityService } from './admin/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './database/university.entity';

@Module({
  imports:[TypeOrmModule.forFeature([University])],
  providers: [UniversityResolver, UniversityService,AdminuniversityResolver,AdminuniversityService]
})
export class UniversityModule {}
