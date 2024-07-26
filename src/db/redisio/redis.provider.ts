import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import configuration from 'src/configs/configuration';
import Redis from 'ioredis';
import { event_name } from 'src/configs/connection.name';

@Injectable()
export class RedisProvider implements OnModuleInit {
    redisClient: Redis;
    redisSubscriber: Redis;
    
    async onModuleInit() {
        this.redisClient = new Redis(configuration().REDIS_URL);
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
                    // call  push to client
                    // this.server.emit("test","akash")
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

    // Create or Update (C/U) a hash value
    async setHashValue(hash: string, key: string, value: string) {
        await this.redisClient.hset(hash, key, value);
    }

    // Read (R) a hash value
    async getHashValue(hash: string, key: string) {
        const value = await this.redisClient.hget(hash, key);
        return value;
    }

    // Delete (D) a hash value
    async deleteHashValue(hash: string, key: string) {
        await this.redisClient.hdel(hash, key);
    }
}