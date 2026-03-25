import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudController } from '../../common/crud/crud.controller';
import { NotificationLog } from '../entities/notification-log.entity';
import { NotificationLogService } from './notification-log.service';

@ApiTags('notification-logs')
@Controller('notification-logs')
export class NotificationLogController extends CrudController<NotificationLog> {
  constructor(protected readonly service: NotificationLogService) {
    super(service);
  }
}
