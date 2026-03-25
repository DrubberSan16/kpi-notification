import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../common/crud/crud.service';
import { NotificationTemplate } from '../entities/notification-template.entity';

@Injectable()
export class NotificationTemplateService extends CrudService<NotificationTemplate> {
  constructor(@InjectRepository(NotificationTemplate) repository: Repository<NotificationTemplate>) {
    super(repository);
  }
}
