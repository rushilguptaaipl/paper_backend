import { Resolver } from '@nestjs/graphql';
import { LibsService } from './libs.service';
import { Lib } from './entities/lib.entity';
import { UseGuards } from '@nestjs/common';
import PermissionGuard from 'src/auth/guards/permission.guard';
import { AtGuard } from 'src/auth/guards/at.guard';

@UseGuards(PermissionGuard())
@UseGuards(AtGuard)
@Resolver(() => Lib)
export class LibsResolver {
  constructor(private readonly libsService: LibsService) { }
}
