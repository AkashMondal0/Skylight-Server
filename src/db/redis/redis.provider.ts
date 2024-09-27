import { Injectable, OnModuleInit } from '@nestjs/common';
import configuration from 'src/configs/configuration';
import Redis from 'ioredis';

@Injectable()
export class RedisProvider implements OnModuleInit {
    redisClient: Redis;

    async onModuleInit() {
        // this.redisClient = new Redis(configuration().REDIS_URL);
    }

    // Create or Update (C/U) a hash value
    async setHashValue(hash: string, key: string, value: string) {
        // await this.redisClient.hset(hash, key, value);
    }

    // Read (R) a hash value
    async getHashValue(hash: string, key: string) {
        // const value = await this.redisClient.hget(hash, key);
        // return value;
    }

    // Delete (D) a hash value
    async deleteHashValue(hash: string, key: string) {
        // await this.redisClient.hdel(hash, key);
    }
}