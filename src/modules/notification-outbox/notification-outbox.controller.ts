import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudController } from '../../common/crud/crud.controller';
import { NotificationOutbox } from '../entities/notification-outbox.entity';
import { NotificationOutboxService } from './notification-outbox.service';

@ApiTags('notification-outbox')
@Controller('notification-outbox')
export class NotificationOutboxController extends CrudController<NotificationOutbox> {
  constructor(protected readonly service: NotificationOutboxService) {
    super(service);
  }
}
