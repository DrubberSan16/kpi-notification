import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../common/crud/crud.service';
import { NotificationLog } from '../entities/notification-log.entity';

@Injectable()
export class NotificationLogService extends CrudService<NotificationLog> {
  constructor(@InjectRepository(NotificationLog) repository: Repository<NotificationLog>) {
    super(repository);
  }
}
