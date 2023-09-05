import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';



@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    
    let options: TypeOrmModuleOptions = {
     
      // entities: [
      //   __dirname + '/../user/database/**/*{.entity.ts,.entity.js}',
      //   __dirname + '/../subject/database/**/*{.entity.ts,.entity.js}',
      //   __dirname + '/../examboard/database/**/*{.entity.ts,.entity.js}',
      //   __dirname + '/../module/database/**/*{.entity.ts,.entity.js}',
      //   __dirname + '/../requests/database/**/*{.entity.ts,.entity.js}',
      //   __dirname + '/../credit-purchased/database/**/*{.entity.ts,.entity.js}'

      // ],
      entities: ["dist/**/*.entity{.ts,.js}"],
      migrations: [
        __dirname + '/../migrations/**/*{.ts,.js}',
      ],
    };

      options = Object.assign(options, {
        type: 'postgres',
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        keepConnectionAlive: true,
        database :process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        synchronize: true,
        migrationsRun: process.env.DB_MIGRATIONS_RUN,
        acquireTimeout: process.env.DB_TIMEOUT,
        logging: process.env.DB_LOGGING,
        extra: {
         // ssl: configService.get('DB_SSL'),
        },
      });
    return options;
  }

}