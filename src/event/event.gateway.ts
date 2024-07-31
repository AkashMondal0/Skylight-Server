import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
import { Message } from 'src/message/entities/message.entity';


@WebSocketGateway({
    cors: {
        origin: ["https://skylight.skysolo.me","https://skylight-test.skysolo.me","http://localhost:3000"],
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
            (err, count) => {
                if (err) {
                    Logger.error('Failed to subscribe', err);
                    return;
                }
                Logger.log(`Subscribed to ${count} channel. Listening for updates on the channel.`);
            });

        this.redisSubscriber.on("message", (channel, message) => {
            const data = JSON.parse(message)
            switch (channel) {
                case event_name.conversation.message:
                    // console.log("client", message)
                    this.server.to(data.members[0]).emit(event_name.conversation.message, data);
                    return
                case event_name.conversation.seen:
                    // console.log("seen", message)
                    return
                case event_name.conversation.typing:
                    // console.log("typing", message)
                    this.server.to(data.members[0]).emit(event_name.conversation.typing, data);
                    return
                default:
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

    /// user message
    @SubscribeMessage(event_name.conversation.message)
    async IncomingClientMessage(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        const ids = await this.findUserBySocketId(data.members)
        if (!ids) return
        await this.redisProvider.redisClient.publish(event_name.conversation.message, JSON.stringify({ ...data, members: ids }))
    }

    /// user typing
    @SubscribeMessage(event_name.conversation.typing)
    async IncomingClientTyping(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        const ids = await this.findUserBySocketId(data.members)
        if (!ids) return
        await this.redisProvider.redisClient.publish(event_name.conversation.typing, JSON.stringify({ ...data, members: ids }))
    }

    // @UseGuards(WsJwtGuard)
    // @UsePipes(new ValidationPipe())
    @SubscribeMessage('test')
    async test(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        // console.log("socket Test", data)
        this.server.emit('test', "this from server - > test");
        // await this.redisSubscriber.publish("test", JSON.stringify({ data: data }))
    }
}