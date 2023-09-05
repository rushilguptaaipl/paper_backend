import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strtegy';
import { ImageUploadLib } from '../libs/image-upload.lib';
import { RestImageUploadLib } from 'src/libs/rest-image-upload.lib';
import { DeviceDetails } from 'src/user/database/device-details.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/database/user.entity';
import { Otp } from 'src/user/database/otp.entity';
import { SMSService } from 'src/user/sms.service';
import { MailService } from 'src/user/mail.service';
import { TransactionalEmailsApi } from '@sendinblue/client';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PassportModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('SECRET_KEY_JWT'),
    //     // signOptions: { expiresIn: 60s,},
    //   }),
    //   inject: [ConfigService],
    // }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([DeviceDetails, Otp, User])
  ],
  providers: [AuthResolver, AuthService, LocalStrategy, TransactionalEmailsApi, MailService, JwtStrategy, AtStrategy, RtStrategy, ImageUploadLib, RestImageUploadLib, SMSService, DeviceDetails],
  exports: [AuthService],
})
export class AuthModule { }
