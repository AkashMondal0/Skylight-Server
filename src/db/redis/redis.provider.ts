import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

if (!process.env.REDIS_URL) throw new Error("REDIS_URL is not defined in .env file");
const url = process.env.REDIS_URL;
@Injectable()
export class RedisProvider implements OnModuleInit {
    client: Redis;
    async onModuleInit() {
        this.client = new Redis(url);
    }
}