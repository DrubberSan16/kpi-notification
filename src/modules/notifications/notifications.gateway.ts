import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/notifications',
  path: '/kpi_notification/socket.io',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const recipient = String(client.handshake.query?.recipient || '').trim();
    if (recipient) {
      client.join(`recipient:${recipient}`);
    }
    client.join('broadcast');
  }

  handleDisconnect(_client: Socket) {
    // no-op
  }

  emitNotification(payload: Record<string, unknown>, recipients: string[] = []) {
    if (recipients.length) {
      const emitted = new Set<string>();
      for (const recipient of recipients) {
        const room = `recipient:${recipient}`;
        if (emitted.has(room)) continue;
        emitted.add(room);
        this.server.to(room).emit('notification:new', payload);
      }
      return;
    }
    this.server.to('broadcast').emit('notification:new', payload);
  }

  @SubscribeMessage('notification:ping')
  handlePing(
    @ConnectedSocket() client: Socket,
    @MessageBody() _payload: Record<string, unknown>,
  ) {
    client.emit('notification:pong', { ok: true, ts: new Date().toISOString() });
  }
}
