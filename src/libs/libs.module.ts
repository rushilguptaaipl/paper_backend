import { Module } from '@nestjs/common';
import { LibsService } from './libs.service';
import { LibsResolver } from './libs.resolver';
import { ImageUploadLib } from './image-upload.lib';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/roles/database/roles.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  providers: [LibsResolver, LibsService, ImageUploadLib],
  exports: [ImageUploadLib],
})
export class LibsModule { }
