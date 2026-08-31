import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
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
    origin: [
      'https://justicecompany-ec.com',
      'https://www.justicecompany-ec.com',
      'http://localhost:5173',
    ],
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    server.use(async (client: Socket, next) => {
      try {
        const token = String(client.handshake.auth?.token || '').trim();
        if (!token) throw new Error('missing-token');
        const response = await fetch(
          'http://127.0.0.1:3015/kpi_security/users/session/validate',
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(5000),
          },
        );
        if (!response.ok) throw new Error(`invalid-token-${response.status}`);
        const payload = (await response.json()) as { user?: Record<string, unknown> };
        client.data.authUser = payload.user ?? {};
        next();
      } catch {
        next(new Error('unauthorized'));
      }
    });
  }

  handleConnection(client: Socket) {
    const user = (client.data.authUser ?? {}) as Record<string, unknown>;
    const recipients = [user.userId, user.nameUser, user.email]
      .map((item) => String(item || '').trim())
      .filter(Boolean);
    if (recipients.length) {
      for (const recipient of recipients) {
        client.join(`recipient:${recipient}`);
      }
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
