import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guard/Ws-Jwt-auth.guard';
import { RedisProvider } from 'src/db/redisio/redis.provider';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  transports: ['websocket'],
  namespace: "chat"
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisProvider: RedisProvider) { }

  extractUserIdAndName(client: Socket): { userId: string, username: string } | null {
    if (!client.id) return null
    const {
      userId,
      username
    } = client.handshake.query as {
      userId: string,
      username: string
    }
    if (!userId || !username) return null
    return { userId, username }
  }

  async handleConnection(client: Socket) {
    const userId = this.extractUserIdAndName(client)?.userId
    if (!userId) return
    await this.redisProvider.setHashValue("skylight:clients", userId, client.id)
  }

  async handleDisconnect(client: Socket) {
    const userId = this.extractUserIdAndName(client)?.userId
    if (!userId) return
    await this.redisProvider.deleteHashValue("skylight:clients", userId)
  }

  @UseGuards(WsJwtGuard)
  // @UsePipes(new ValidationPipe())
  @SubscribeMessage('events')
  async findAll(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log("event", data)
    const username = await this.redisProvider.getHashValue("skylight:clients", data)
    this.server.to(client.id).emit('events', username);
  }

  @SubscribeMessage('incoming-message')
  async incomingMessage(@MessageBody() data: number): Promise<number> {
    return data;
  }
  @SubscribeMessage('incoming-user-keyboard-pressing')
  async incomingUserKeyboardPressing(@MessageBody() data: number): Promise<number> {
    return data;
  }
  @SubscribeMessage('incoming-message-seen')
  async incomingMessageSeen(@MessageBody() data: number): Promise<number> {
    return data;
  }
  @SubscribeMessage('incoming-notification')
  async incomingNotification(@MessageBody() data: number): Promise<number> {
    return data;
  }
}