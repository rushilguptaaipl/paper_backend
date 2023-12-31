import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/user.entity';
import { Roles } from '../roles/database/roles.entity';
import { Status } from './database/status.entity';
import { Otp } from './database/otp.entity';
import { IsEmailAlreadyExistConstraint } from './validation/email-validation';
import { MailService } from './mail.service';

import { TransactionalEmailsApi } from '@sendinblue/client';
import { ImageUploadLib } from '../libs/image-upload.lib'
import { UserController } from './user.controller';
import { RestImageUploadLib } from 'src/libs/rest-image-upload.lib';
import { UserRepository } from './repositories/user.repository'
import { AdminResolver } from './admin/admin.resolver';
import { AdminService } from './admin/admin.service';
import { BlockedUser } from './database/blocked-user.entity'
import { SMSService } from './sms.service';



@Module({
  imports: [TypeOrmModule.forFeature([User, Roles, Otp, Status, BlockedUser])],
  providers: [UserResolver, UserService, SMSService, IsEmailAlreadyExistConstraint, MailService, TransactionalEmailsApi, ImageUploadLib, RestImageUploadLib, UserRepository, AdminResolver, AdminService],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule { }
