import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { htmlToText } from 'html-to-text';

@Injectable()
export class SMSService {
    async mobileConfirmation(mobile: string, otp: number) {
        const configService = new ConfigService();

        const accountSid = configService.get('TWILIO_ACCOUNT_SID');
        const authToken = configService.get('TWILIO_AUTH_TOKEN');
        const client = require('twilio')(accountSid, authToken);

        const messageBody = `
        <html>
        <h5>Flash App</h5>
        Here is Your OTP to login: 
        <strong>${otp}</strong>
        </html>
      `;

        const plainTextMessage = htmlToText(messageBody);

        client.messages
            .create({
                body: plainTextMessage,
                from: configService.get('TWILIO_PHONE_NUMBER'),
                to: mobile,
            })
            .then((message) => message.sid);
    }
}
