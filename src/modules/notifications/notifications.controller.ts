import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post('in-app')
  @ApiOperation({ summary: 'Crear notificación in-app y emitirla en tiempo real' })
  @ApiBody({ schema: { type: 'object', additionalProperties: true } })
  createInApp(@Body() payload: Record<string, unknown>) {
    return this.service.createInAppNotification({
      title: String(payload.title || 'Notificación'),
      body: String(payload.body || ''),
      module: payload.module ? String(payload.module) : 'general',
      entityType: payload.entityType ? String(payload.entityType) : 'generic',
      entityId: payload.entityId ? String(payload.entityId) : null,
      level: payload.level ? String(payload.level) : 'info',
      recipients: Array.isArray(payload.recipients)
        ? payload.recipients.map((item) => String(item))
        : [],
      createdBy: payload.createdBy ? String(payload.createdBy) : null,
    });
  }

  @Get('in-app')
  @ApiOperation({ summary: 'Listar notificaciones in-app' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'recipient', required: false, type: String })
  listInApp(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('recipient') recipient?: string,
  ) {
    return this.service.listInAppNotifications({
      status,
      limit: limit ? Number(limit) : undefined,
      recipient,
    });
  }

  @Patch('in-app/:id/read')
  @ApiOperation({ summary: 'Marcar una notificación in-app como leída' })
  @ApiParam({ name: 'id', type: String })
  markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }

  @Patch('in-app/read-all')
  @ApiOperation({ summary: 'Marcar todas las notificaciones in-app como leídas' })
  @ApiQuery({ name: 'recipient', required: false, type: String })
  markAllAsRead(@Query('recipient') recipient?: string) {
    return this.service.markAllAsRead(recipient);
  }
}
