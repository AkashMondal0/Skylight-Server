import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { DrizzleProvider } from 'src/db/drizzle/drizzle.provider';
import { RedisProvider } from 'src/db/redisio/redis.provider';

@Injectable()
export class MessageService {
  constructor(
    private readonly drizzleProvider: DrizzleProvider,
    private readonly redisProvider: RedisProvider
  ) { }
  create(createMessageInput: CreateMessageInput) {
    return 'This action adds a new message';
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageInput: UpdateMessageInput) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
