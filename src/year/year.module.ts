import { Module } from '@nestjs/common';
import { YearResolver } from './year.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Year } from './database/year.entity';
import { AdminYearService } from './admin/admin-year.service';
import { AdminYearResolver } from './admin/admin-year.resolver';
import { YearService } from './year.service';

@Module({
  imports:[TypeOrmModule.forFeature([Year])],
  providers: [YearResolver,AdminYearResolver,AdminYearService, YearService]
})
export class YearModule {}
