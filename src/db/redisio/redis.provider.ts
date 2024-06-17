import { Injectable, OnModuleInit } from '@nestjs/common';
import configuration from 'src/configs/configuration';
import Redis from 'ioredis';

@Injectable()
export class RedisProvider implements OnModuleInit {
    // redisClient: Redis;

    async onModuleInit() {
        // this.redisClient = new Redis(configuration().REDIS_URL);
    }
}