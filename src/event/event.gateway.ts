import { Injectable, UseGuards } from '@nestjs/common';
import { event_name } from 'src/configs/connection.name';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guard/Ws-Jwt-auth.guard';
import { Notification } from 'src/notification/entities/notification.entity';


@WebSocketGateway({
    cors: {
        origin: ["*"],
        credentials: true,
    },
    transports: ['websocket'],
    namespace: "chat"
})

@Injectable()
export class EventGateway {
    @WebSocketServer()
    server: Server;
    socketClients: { [key: string]: string } = {}

    async findUserBySocketId(userIds?: string[]): Promise<string[] | null> {
        if (!userIds || userIds.length < 0) return null
        const ids = await Promise.all(userIds?.map(async (userId) => {
            return this.socketClients[userId]
        }) ?? []);
        if (!ids || ids.length < 0) return null
        return ids.filter(id => id !== null || id !== undefined) as string[];
    }

    async handleConnection(client: Socket) {
        const userId = client.handshake.query?.userId as string
        if (!userId) return
        this.socketClients[userId] = client.id
    }

    async handleDisconnect(client: Socket) {
        const userId = client.handshake.query?.userId as string
        if (!userId) return
        delete this.socketClients[userId]
    }

    /// user message seen
    @UseGuards(WsJwtGuard)
    @SubscribeMessage(event_name.conversation.message)
    async IncomingClientMessage(
        @MessageBody() data: any
    ) {
        const ids = await this.findUserBySocketId(data.members)
        if (!ids) return
        this.server.to(ids).emit(event_name.conversation.message, data);
    }

    /// user message
    @UseGuards(WsJwtGuard)
    @SubscribeMessage(event_name.conversation.seen)
    async IncomingClientMessageSeen(
        @MessageBody() data: any
    ) {
        const ids = await this.findUserBySocketId(data.members)
        if (!ids) return
        this.server.to(ids).emit(event_name.conversation.seen, data);
    }

    /// user typing
    @UseGuards(WsJwtGuard)
    @SubscribeMessage(event_name.conversation.typing)
    async IncomingClientTyping(
        @MessageBody() data: any
    ) {
        const ids = await this.findUserBySocketId(data.members)
        if (!ids) return
        this.server.to(ids).emit(event_name.conversation.typing, data);
    }
    // notification

    @UseGuards(WsJwtGuard)
    @SubscribeMessage(event_name.notification.post)
    async IncomingClientLikeNotification(
        @MessageBody() data: Notification
    ) {
        const ids = await this.findUserBySocketId([data.recipientId])
        if (!ids) return
        this.server.to(ids).emit(event_name.notification.post, data);
    }

    // @UseGuards(WsJwtGuard)
    // @UsePipes(new ValidationPipe())
    @SubscribeMessage('test')
    async test(
        @MessageBody() data: any,
    ) {
        this.server.emit('test', "this from server - > test");
    }
}