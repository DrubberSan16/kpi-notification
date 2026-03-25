import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'kpi_notification', name: 'tb_notification_channel' })
export class NotificationChannel {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'text' }) code: string;
  @Column({ type: 'text' }) name: string;
  @Column({ type: 'text', default: 'ACTIVE' }) status: string;
  @Column({ type: 'timestamp without time zone', default: () => 'now()' }) created_at: Date;
  @Column({ type: 'timestamp without time zone', default: () => 'now()' }) updated_at: Date;
  @Column({ type: 'text', nullable: true }) created_by?: string | null;
  @Column({ type: 'text', nullable: true }) updated_by?: string | null;
  @Column({ type: 'boolean', default: false }) is_deleted: boolean;
}
