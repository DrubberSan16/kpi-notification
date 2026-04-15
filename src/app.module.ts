import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from './modules/entities';
import { NotificationChannelModule } from './modules/notification-channel/notification-channel.module';
import { NotificationLogModule } from './modules/notification-log/notification-log.module';
import { NotificationOutboxModule } from './modules/notification-outbox/notification-outbox.module';
import { NotificationTemplateModule } from './modules/notification-template/notification-template.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sslEnabled = String(config.get('DB_SSL') || 'false') === 'true';
        const appTimeZone =
          String(config.get('APP_TIMEZONE') || '').trim() ||
          'America/Guayaquil';
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
          extra: { options: `-c timezone=${appTimeZone}` },
        };
      },
    }),
    NotificationChannelModule,
    NotificationLogModule,
    NotificationOutboxModule,
    NotificationTemplateModule,
    NotificationsModule,
  ],
})
export class AppModule {}
