import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  private authenticatedRecipients(
    userId?: string,
    userName?: string,
    userEmail?: string,
  ) {
    const recipients = [...new Set([userId, userName, userEmail]
      .map((item) => String(item || '').trim())
      .filter(Boolean))];
    if (!recipients.length) throw new ForbiddenException('Identidad autenticada requerida');
    return recipients.join(',');
  }

  @Post('in-app')
  @ApiOperation({ summary: 'Crear notificación in-app y emitirla en tiempo real' })
  @ApiBody({ schema: { type: 'object', additionalProperties: true } })
  createInApp(
    @Body() payload: Record<string, unknown>,
    @Headers('x-internal-authenticated') internalAuthenticated?: string,
  ) {
    if (String(internalAuthenticated || '').toLowerCase() !== 'true') {
      throw new ForbiddenException('Solo servicios internos pueden crear notificaciones');
    }
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

  @Post('data-changed')
  @ApiOperation({
    summary:
      'Emite una senal efimera de cambio de datos para que las pantallas abiertas se refresquen',
  })
  @ApiBody({ schema: { type: 'object', additionalProperties: true } })
  broadcastDataChanged(@Body() payload: Record<string, unknown>) {
    return this.service.broadcastDataChanged(payload ?? {});
  }

  @Get('in-app')
  @ApiOperation({ summary: 'Listar notificaciones in-app' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'recipient', required: false, type: String })
  listInApp(
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Headers('x-user-id') userId?: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
  ) {
    return this.service.listInAppNotifications({
      status,
      limit: limit ? Number(limit) : undefined,
      recipient: this.authenticatedRecipients(userId, userName, userEmail),
    });
  }

  @Patch('in-app/:id/read')
  @ApiOperation({ summary: 'Marcar una notificación in-app como leída' })
  @ApiParam({ name: 'id', type: String })
  markAsRead(
    @Param('id') id: string,
    @Headers('x-user-id') userId?: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
  ) {
    return this.service.markAsRead(
      id,
      this.authenticatedRecipients(userId, userName, userEmail),
    );
  }

  @Patch('in-app/read-all')
  @ApiOperation({ summary: 'Marcar todas las notificaciones in-app como leídas' })
  @ApiQuery({ name: 'recipient', required: false, type: String })
  markAllAsRead(
    @Headers('x-user-id') userId?: string,
    @Headers('x-user-name') userName?: string,
    @Headers('x-user-email') userEmail?: string,
  ) {
    return this.service.markAllAsRead(
      this.authenticatedRecipients(userId, userName, userEmail),
    );
  }
}
