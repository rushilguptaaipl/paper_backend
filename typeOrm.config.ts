import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const configService = new ConfigService();
module.exports = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  synchronize: configService.get('DB_SYNCHRONIZE'),
  migrationsRun: configService.get('DB_MIGRATIONS_RUN'),
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: [
    __dirname + '/migrations/**/*{.ts,.js}',
  ],
  factories: ["dist/seeder/factories/**/*.{js, ts}"],
  seeds: ["dist/**/seeder/**/*.{js, ts}"],
}

