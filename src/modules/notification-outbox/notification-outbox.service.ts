import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../common/crud/crud.service';
import { NotificationOutbox } from '../entities/notification-outbox.entity';

@Injectable()
export class NotificationOutboxService extends CrudService<NotificationOutbox> {
  constructor(@InjectRepository(NotificationOutbox) repository: Repository<NotificationOutbox>) {
    super(repository);
  }
}
