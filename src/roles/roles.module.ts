import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminResolver } from './admin/admin.resolver';
import { AdminService } from './admin/admin.service';
import { Roles } from './database/roles.entity';
import { AdminRepository } from './repositories/admin/admin.repository';

@Module({
  imports:[TypeOrmModule.forFeature([Roles])],
  providers: [AdminResolver, AdminService, AdminRepository]
})
export class RolesModule {}
