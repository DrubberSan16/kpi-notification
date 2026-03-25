import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'kpi_notification', name: 'tb_notification_outbox' })
export class NotificationOutbox {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'text' }) template_code: string;
  @Column({ type: 'text' }) channel_code: string;
  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" }) to_recipients: unknown[];
  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" }) cc_recipients: unknown[];
  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" }) payload: Record<string, unknown>;
  @Column({ type: 'integer', default: 5 }) priority: number;
  @Column({ type: 'text', default: 'PENDING' }) status: string;
  @Column({ type: 'integer', default: 0 }) attempts: number;
  @Column({ type: 'text', nullable: true }) last_error?: string | null;
  @Column({ type: 'timestamp without time zone', nullable: true }) scheduled_at?: Date | null;
  @Column({ type: 'timestamp without time zone', nullable: true }) sent_at?: Date | null;
  @Column({ type: 'timestamp without time zone', default: () => 'now()' }) created_at: Date;
  @Column({ type: 'timestamp without time zone', default: () => 'now()' }) updated_at: Date;
  @Column({ type: 'text', nullable: true }) created_by?: string | null;
  @Column({ type: 'text', nullable: true }) updated_by?: string | null;
  @Column({ type: 'boolean', default: false }) is_deleted: boolean;
}
