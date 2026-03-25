export * from './notification-channel.entity';
export * from './notification-log.entity';
export * from './notification-outbox.entity';
export * from './notification-template.entity';

import { NotificationChannel } from './notification-channel.entity';
import { NotificationLog } from './notification-log.entity';
import { NotificationOutbox } from './notification-outbox.entity';
import { NotificationTemplate } from './notification-template.entity';

export const ENTITIES = [
  NotificationChannel,
  NotificationLog,
  NotificationOutbox,
  NotificationTemplate
];
