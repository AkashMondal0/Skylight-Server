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
        origin: ["https://skylight.skysolo.me", true],
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
            switch (channel) {
                case event_name.conversation.message:
                    this.server.emit('test', message);
                    return
                case event_name.conversation.seen:
                    console.log("seen", message)
                    return
                case event_name.conversation.typing:
                    console.log("typing", message)
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

    // @UseGuards(WsJwtGuard)
    // @UsePipes(new ValidationPipe())
    @SubscribeMessage('events')
    async findAll(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        console.log("event", data)
        const username = await this.redisProvider.getHashValue("skylight:clients", data)
        this.server.emit('events', { data: username, message: "event" });
        this.server.to(client.id).emit('events', username);
    }

    @SubscribeMessage('incoming-message-client')
    async incomingMessage(@MessageBody() data: Message,
        @ConnectedSocket() client: Socket) {

        const userIds = await Promise.all(data.members?.map(async (userId) => {
            return await this.redisProvider.getHashValue("skylight:clients", userId);
        }) ?? []);

        if (!userIds[0]) return
        this.server.to(userIds[0]).emit('incoming-message-server', data);
        //   this.redisProvider.redisClient.publish("message", JSON.stringify(data));
    }

    @SubscribeMessage('test')
    async test(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        console.log("socket Test", data)
        this.server.emit('test', data);
    }
}