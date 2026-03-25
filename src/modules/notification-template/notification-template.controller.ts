import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudController } from '../../common/crud/crud.controller';
import { NotificationTemplate } from '../entities/notification-template.entity';
import { NotificationTemplateService } from './notification-template.service';

@ApiTags('notification-templates')
@Controller('notification-templates')
export class NotificationTemplateController extends CrudController<NotificationTemplate> {
  constructor(protected readonly service: NotificationTemplateService) {
    super(service);
  }
}
