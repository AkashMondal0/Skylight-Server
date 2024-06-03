import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    namespace: '/chat',
    cors: {
        origin: '*',
    },
})
export class SocketIoEventsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('handleMessageEvent')
    handleMessageEvent(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ): void {
        client.emit('MessageEvent', data);
    }
}