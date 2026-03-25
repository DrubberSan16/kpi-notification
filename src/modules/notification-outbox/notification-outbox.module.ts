import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationOutbox } from '../entities/notification-outbox.entity';
import { NotificationOutboxController } from './notification-outbox.controller';
import { NotificationOutboxService } from './notification-outbox.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationOutbox])],
  controllers: [NotificationOutboxController],
  providers: [NotificationOutboxService],
  exports: [NotificationOutboxService],
})
export class NotificationOutboxModule {}
