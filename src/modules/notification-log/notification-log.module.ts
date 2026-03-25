import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationLog } from '../entities/notification-log.entity';
import { NotificationLogController } from './notification-log.controller';
import { NotificationLogService } from './notification-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationLog])],
  controllers: [NotificationLogController],
  providers: [NotificationLogService],
  exports: [NotificationLogService],
})
export class NotificationLogModule {}
