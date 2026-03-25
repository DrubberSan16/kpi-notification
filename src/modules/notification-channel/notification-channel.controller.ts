import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudController } from '../../common/crud/crud.controller';
import { NotificationChannel } from '../entities/notification-channel.entity';
import { NotificationChannelService } from './notification-channel.service';

@ApiTags('notification-channels')
@Controller('notification-channels')
export class NotificationChannelController extends CrudController<NotificationChannel> {
  constructor(protected readonly service: NotificationChannelService) {
    super(service);
  }
}
