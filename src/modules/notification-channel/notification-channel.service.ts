import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../../common/crud/crud.service';
import { NotificationChannel } from '../entities/notification-channel.entity';

@Injectable()
export class NotificationChannelService extends CrudService<NotificationChannel> {
  constructor(@InjectRepository(NotificationChannel) repository: Repository<NotificationChannel>) {
    super(repository);
  }
}
