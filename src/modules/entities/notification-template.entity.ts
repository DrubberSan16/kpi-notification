import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'kpi_notification', name: 'tb_notification_template' })
export class NotificationTemplate {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'text' }) code: string;
  @Column({ type: 'text' }) channel_code: string;
  @Column({ type: 'text', nullable: true }) subject?: string | null;
  @Column({ type: 'text' }) body: string;
  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" }) variables_json: unknown[];
  @Column({ type: 'text', default: 'ACTIVE' }) status: string;
  @Column({ type: 'timestamp without time zone', default: () => 'now()' }) created_at: Date;
  @Column({ type: 'timestamp without time zone', default: () => 'now()' }) updated_at: Date;
  @Column({ type: 'text', nullable: true }) created_by?: string | null;
  @Column({ type: 'text', nullable: true }) updated_by?: string | null;
  @Column({ type: 'boolean', default: false }) is_deleted: boolean;
}
