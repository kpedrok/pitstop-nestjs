import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AccessCodeModule } from './access-code/access-code.module';
import { AccessDoorModule } from './access-door/access-door.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntryHistoryModule } from './entry-history/entry-history.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        host: configService.get('DB_HOST'),
        database: configService.get('DB_NAME'),
        port: +configService.get('DB_PORT'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: true, // remove for production and implement migrations
        logging: true, // remove for prod
        extra: {
          max: 10, // Maximum number of connections in the pool
          idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
        },
      }),
    }),
    EntryHistoryModule,
    AccessCodeModule,
    AccessDoorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
