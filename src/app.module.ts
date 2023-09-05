import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import path, { join, dirname } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';



import { UserModule } from './user/user.module';
// ORM AND DATABASE TBALES
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

import {
  AcceptLanguageResolver,
  GraphQLWebsocketResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { RouteAccessClassMiddleware } from './common/middleware/route-access-class.middleware';
import { TypeOrmService } from './typeorm/type-orm.service';
import { SubjectModule } from './subject/subject.module';

config();
const configService = new ConfigService();
console.log(configService.get('GRAPHQL_INTROSPECTION'));
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'public'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
      debug: false,
      playground: false,
      autoSchemaFile: true,
      // introspection:JSON.parse(configService.get('GRAPHQL_INTROSPECTION'))
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        GraphQLWebsocketResolver,
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    MailerModule.forRoot({
      transport: {
        host: configService.get('SMTP_HOST'),
        port: configService.get('SMTP_PORT'),
        secure: configService.get('SMTP_SECURE'),
        auth: {
          user: configService.get('SMTP_USER'),
          pass: configService.get('SMTP_PASSWORD'),
        },
      },
      defaults: {
        from: configService.get('SMTP_FROM'),
      },
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    SubjectModule,
  ],

  providers: [AppService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RouteAccessClassMiddleware).forRoutes('*');
  }
}
