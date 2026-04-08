import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationLog } from '../entities/notification-log.entity';
import { NotificationOutbox } from '../entities/notification-outbox.entity';
import { NotificationsGateway } from './notifications.gateway';

type InAppNotificationInput = {
  title: string;
  body: string;
  module?: string;
  entityType?: string;
  entityId?: string | null;
  level?: string;
  recipients?: string[];
  createdBy?: string | null;
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationOutbox)
    private readonly outboxRepo: Repository<NotificationOutbox>,
    @InjectRepository(NotificationLog)
    private readonly logRepo: Repository<NotificationLog>,
    private readonly gateway: NotificationsGateway,
  ) {}

  private mapNotification(row: NotificationOutbox) {
    const payload = (row.payload ?? {}) as Record<string, unknown>;
    return {
      id: row.id,
      title: String(payload.title || 'Notificación'),
      body: String(payload.body || ''),
      module: String(payload.module || ''),
      entityType: payload.entityType ?? null,
      entityId: payload.entityId ?? null,
      level: String(payload.level || 'info'),
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      recipients: Array.isArray(row.to_recipients) ? row.to_recipients : [],
      payload,
    };
  }

  private parseRecipientsFilter(input?: string) {
    return [
      ...new Set(
        String(input || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ];
  }

  async createInAppNotification(input: InAppNotificationInput) {
    const recipients = (input.recipients ?? []).filter(Boolean);
    const row = await this.outboxRepo.save(
      this.outboxRepo.create({
        template_code: 'IN_APP_GENERIC',
        channel_code: 'IN_APP',
        to_recipients: recipients,
        cc_recipients: [],
        payload: {
          title: input.title,
          body: input.body,
          module: input.module ?? 'general',
          entityType: input.entityType ?? null,
          entityId: input.entityId ?? null,
          level: input.level ?? 'info',
        },
        priority: 5,
        status: 'NEW',
        attempts: 1,
        sent_at: new Date(),
        created_by: input.createdBy ?? null,
      }),
    );

    await this.logRepo.save(
      this.logRepo.create({
        outbox_id: row.id,
        channel_code: 'IN_APP',
        to_recipients: recipients,
        subject: input.title,
        rendered_body: input.body,
        status: 'DELIVERED',
        sent_at: new Date(),
      }),
    );

    const mapped = this.mapNotification(row);
    this.gateway.emitNotification(mapped, recipients);
    return mapped;
  }

  async listInAppNotifications(filters: {
    status?: string;
    limit?: number;
    recipient?: string;
  }) {
    const take = Math.min(Math.max(Number(filters.limit || 20), 1), 100);
    const qb = this.outboxRepo
      .createQueryBuilder('n')
      .where('n.is_deleted = false')
      .andWhere('n.channel_code = :channel', { channel: 'IN_APP' })
      .orderBy('n.created_at', 'DESC')
      .take(take * 4);

    if (filters.status) {
      qb.andWhere('n.status = :status', { status: filters.status.toUpperCase() });
    }

    const rows = await qb.getMany();
    const recipientTokens = this.parseRecipientsFilter(filters.recipient);
    const filtered = rows.filter((row) => {
      const recipients = Array.isArray(row.to_recipients) ? row.to_recipients.map(String) : [];
      if (!recipientTokens.length) return true;
      if (!recipients.length) return true;
      return recipientTokens.some((token) => recipients.includes(token));
    });

    return filtered.slice(0, take).map((row) => this.mapNotification(row));
  }

  async markAsRead(id: string) {
    const row = await this.outboxRepo.findOne({
      where: { id, is_deleted: false, channel_code: 'IN_APP' },
    });
    if (!row) return { id, updated: false };
    row.status = 'READ';
    await this.outboxRepo.save(row);
    return { id, updated: true };
  }

  async markAllAsRead(recipient?: string) {
    const rows = await this.outboxRepo.find({
      where: { is_deleted: false, channel_code: 'IN_APP', status: 'NEW' },
      order: { created_at: 'DESC' },
      take: 200,
    });

    const recipientTokens = this.parseRecipientsFilter(recipient);
    const selected = rows.filter((row) => {
      const recipients = Array.isArray(row.to_recipients) ? row.to_recipients.map(String) : [];
      if (!recipientTokens.length) return true;
      if (!recipients.length) return true;
      return recipientTokens.some((token) => recipients.includes(token));
    });

    for (const row of selected) {
      row.status = 'READ';
    }
    if (selected.length) await this.outboxRepo.save(selected);
    return { updated: selected.length };
  }
}
