import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'kpi_notification', name: 'tb_notification_log' })
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid', nullable: true }) outbox_id?: string | null;
  @Column({ type: 'text' }) channel_code: string;
  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" }) to_recipients: unknown[];
  @Column({ type: 'text', nullable: true }) subject?: string | null;
  @Column({ type: 'text', nullable: true }) rendered_body?: string | null;
  @Column({ type: 'text' }) status: string;
  @Column({ type: 'text', nullable: true }) error?: string | null;
  @Column({ type: 'timestamp without time zone', nullable: true }) sent_at?: Date | null;
  @Column({ type: 'timestamp without time zone', default: () => 'now()' }) created_at: Date;
  @Column({ type: 'timestamp without time zone', default: () => 'now()' }) updated_at: Date;
  @Column({ type: 'boolean', default: false }) is_deleted: boolean;
}
