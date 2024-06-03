import { Module } from '@nestjs/common';
import { SocketIoEventsGateway } from './events.gateway';

@Module({
  providers: [SocketIoEventsGateway],
})
export class SocketIoEventsModule {}