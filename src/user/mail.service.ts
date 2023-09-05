import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionalEmailsApi } from '@sendinblue/client';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private transactionalEmailsApi: TransactionalEmailsApi,
  ) {}

  async sendUserConfirmation(email: string, otp: number) {
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: 'Otp to verify',
    //   html: '<h1>Flash App </h1><h3>Here is Your OTP to verify email '+ otp+'</h3><h2></h2>',
    // });
    const configService = new ConfigService();

    await this.transactionalEmailsApi.setApiKey(0,configService.get('SENDINBLUE_APIKEY'));

    await this.transactionalEmailsApi.sendTransacEmail({
      sender: {
        name: configService.get('SENDINBLUE_NAME'),
        email: configService.get('SENDINBLUE_SENDER'),
      },
      to: [
        {
          email: email,
        },
      ],
      replyTo: {
        email: configService.get('SENDINBLUE_REPLYTO'),
      },
      subject: 'Otp to verify',
      htmlContent:
        '<h1>Flash App </h1><h3>Here is Your OTP to verify email ' + otp +'</h3><h2></h2>',
    });
  }
}
