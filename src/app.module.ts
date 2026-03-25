import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from './modules/entities';
import { NotificationChannelModule } from './modules/notification-channel/notification-channel.module';
import { NotificationLogModule } from './modules/notification-log/notification-log.module';
import { NotificationOutboxModule } from './modules/notification-outbox/notification-outbox.module';
import { NotificationTemplateModule } from './modules/notification-template/notification-template.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sslEnabled = String(config.get('DB_SSL') || 'false') === 'true';
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: Number(config.get('DB_PORT') || 5432),
          username: config.get('DB_USER'),
          password: config.get('DB_PASS'),
          database: config.get('DB_NAME'),
          schema: 'kpi_notification',
          entities: ENTITIES,
          autoLoadEntities: false,
          synchronize: false,
          logging: false,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          extra: { options: '-c timezone=UTC' },
        };
      },
    }),
    NotificationChannelModule,
    NotificationLogModule,
    NotificationOutboxModule,
    NotificationTemplateModule,
  ],
})
export class AppModule {}
