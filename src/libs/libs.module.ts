import { Module } from '@nestjs/common';
import { LibsService } from './libs.service';
import { LibsResolver } from './libs.resolver';
import { ImageUploadLib } from './image-upload.lib';


@Module({
  providers: [LibsResolver, LibsService , ImageUploadLib ],
  exports: [ImageUploadLib ],
})
export class LibsModule {}
