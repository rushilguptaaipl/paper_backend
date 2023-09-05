import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv'
import * as fs from 'fs';

config();
const configService = new ConfigService();
async function bootstrap() {
  const ssl = configService.get('SSL') === 'true' ? true : false;
  const port = Number(configService.get('PORT')) || 3000;
  let httpsOptions = null;
  if (ssl) {
    httpsOptions = {
      key: fs.readFileSync(configService.get('HTTPS_KEY')),
      cert: fs.readFileSync(configService.get('HTTPS_CERT')),
      ca: [
        fs.readFileSync(configService.get('HTTPS_CA')),
      ]
    };
  }

  const app = await NestFactory.create(AppModule , {httpsOptions});
  // app.use(graphqlUploadExpress());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  
  app.enableCors();
  // app.use(RouteAccess);
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
