import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationChannel } from '../entities/notification-channel.entity';
import { NotificationChannelController } from './notification-channel.controller';
import { NotificationChannelService } from './notification-channel.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationChannel])],
  controllers: [NotificationChannelController],
  providers: [NotificationChannelService],
  exports: [NotificationChannelService],
})
export class NotificationChannelModule {}
