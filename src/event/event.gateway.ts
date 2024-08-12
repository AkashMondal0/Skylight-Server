import { Injectable, Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import configuration from 'src/configs/configuration';
import Redis from 'ioredis';
import { event_name } from 'src/configs/connection.name';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisProvider } from '../db/redis/redis.provider';
import { WsJwtGuard } from 'src/auth/guard/Ws-Jwt-auth.guard';
import { Notification } from 'src/notification/entities/notification.entity';


@WebSocketGateway({
    cors: {
        origin: [
            "https://skylight.skysolo.me",
            "https://skylight-test.skysolo.me",
            "http://localhost:3000"],
        credentials: true,
    },
    transports: ['websocket'],
    namespace: "chat"
})

@Injectable()
export class EventGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    redisSubscriber: Redis;
    constructor(private readonly redisProvider: RedisProvider) { }

    async onModuleInit() {
        this.redisSubscriber = new Redis(configuration().REDIS_URL);

        if (!this.redisSubscriber) {
            Logger.log('Redis subscriber not initialized');
            return;
        }

        this.redisSubscriber.subscribe(
            event_name.conversation.message,
            event_name.conversation.seen,
            event_name.conversation.typing,
            event_name.notification.post.like,
            event_name.notification.post.comment,
            "test",
            (err, count) => {
                if (err) {
                    Logger.error('Failed to subscribe', err);
                    return;
                }
                Logger.log(`Subscribed to ${count} channel. Listening for updates on the channel.`);
                return
            });

        this.redisSubscriber.on("message", (channel, message) => {
            const data = JSON.parse(message)
            switch (channel) {
                case event_name.conversation.message:
                    this.server.to(data.members).emit(event_name.conversation.message, data);
                    return
                case event_name.conversation.seen:
                    this.server.to(data.members).emit(event_name.conversation.seen, data);
                    return
                case event_name.conversation.typing:
                    this.server.to(data.members).emit(event_name.conversation.typing, data);
                    return
                case event_name.notification.post.like:
                    this.server.to(data.members).emit(event_name.notification.post.like, data);
                    return
                case event_name.notification.post.comment:
                    this.server.to(data.members).emit(event_name.notification.post.comment, data);
                    return
                default:
                    this.server.emit("test", data);
                    return
            }
        });
    }


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

    async findUserBySocketId(userIds?: string[]): Promise<string[] | null> {

        if (!userIds || userIds.length < 0) return null

        const ids = await Promise.all(userIds?.map(async (userId) => {
            return await this.redisProvider.getHashValue("skylight:clients", userId);
        }) ?? []);

        if (!ids || ids.length < 0) return null

        return ids.filter(id => id !== null) as string[];
    }

    publishMessage(channel: string, data: any) {
        this.redisProvider.redisClient.publish(channel, JSON.stringify(data))
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

    /// user message seen
    @UseGuards(WsJwtGuard)
    @SubscribeMessage(event_name.conversation.message)
    async IncomingClientMessage(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        const ids = await this.findUserBySocketId(data.members)
        if (!ids) return
        this.redisProvider.redisClient.publish(event_name.conversation.message, JSON.stringify({ ...data, members: ids }))
    }

    /// user message
    @UseGuards(WsJwtGuard)
    @SubscribeMessage(event_name.conversation.seen)
    async IncomingClientMessageSeen(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        const ids = await this.findUserBySocketId(data.members)
        if (!ids) return
        this.redisProvider.redisClient.publish(event_name.conversation.seen, JSON.stringify({ ...data, members: ids }))
    }

    /// user typing
    @UseGuards(WsJwtGuard)
    @SubscribeMessage(event_name.conversation.typing)
    async IncomingClientTyping(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        const ids = await this.findUserBySocketId(data.members)
        if (!ids) return
        this.redisProvider.redisClient.publish(event_name.conversation.typing, JSON.stringify({ ...data, members: ids }))
    }
    // notification
    // @UseGuards(WsJwtGuard)
    // @SubscribeMessage(event_name.notification.post.comment)
    // async IncomingClientCommentNotification(
    //     @MessageBody() data: PostActionsProps,
    //     @ConnectedSocket() client: Socket,
    // ) {
    //     const ids = await this.findUserBySocketId(data.members)
    //     if (!ids) return
    //     this.redisProvider.redisClient.publish(event_name.notification.post.comment, JSON.stringify({ ...data, members: ids }))
    // }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage(event_name.notification.post.like)
    async IncomingClientLikeNotification(
        @MessageBody() data: Notification,
        @ConnectedSocket() client: Socket,
    ) {
        const ids = await this.findUserBySocketId([data.recipientId])
        if (!ids) return
        this.redisProvider.redisClient.publish(event_name.notification.post.like, JSON.stringify({ ...data, members: ids }))
    }

    // @UseGuards(WsJwtGuard)
    // @UsePipes(new ValidationPipe())
    @SubscribeMessage('test')
    async test(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        this.server.emit('test', "this from server - > test");
        this.redisSubscriber.publish("test", JSON.stringify({ data: data }))
    }
}