import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, WsException, OnGatewayDisconnect } from '@nestjs/websockets';
import { parseCookie, verifyToken } from 'src/utils';
import { Socket, Server } from 'socket.io'
import { UnauthorizedException } from '@nestjs/common';
import { MessageServicev1 } from './message.service';
import 'src/utils/cookie'

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
  }
})
export class MessageGatewayv1 implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private messageService: MessageServicev1) { }

  async handleConnection(socket: Socket) {
    try {
      const userCred = await this.messageService.getUserCred(socket);
      console.log("User authenticated")
      await this.messageService.storeSocketId(userCred.username, socket);
      socket.handshake.auth = { userCred }
    } catch (err) {
      socket.emit("ERROR", new UnauthorizedException());
      socket.disconnect();
    }
  }

  // async handleDisconnect(socket: Socket) {
  //   try {
  //     const userCred = await this.messageService.getUserCred(socket);
  //     await this.messageService.deleteSocketId(userCred.username);
  //   } catch (err) {
  //     console.error(err.message);
  //     socket.emit("ERROR", new UnauthorizedException());
  //     socket.disconnect();
  //   }
  // }

  @SubscribeMessage('message')
  async handleMessage(socket: Socket, payload: { chatId: string, to: string, message: string }) {
    const { chatId, to, message } = payload;
    const { username: from, role } = socket.handshake.auth.userCred as { username: string, role: string };
    console.log(payload);
    const { storedMessage, users } = await this.messageService.createMessage(chatId, from, to, message);
    console.log(storedMessage);
    console.log(users);
    users.forEach(user => {
      socket.to(user.socketId).emit('recieve-message', { message: storedMessage, chatId })
    })
    socket.emit('recieve-message', { message: storedMessage, chatId })
  }

  @SubscribeMessage('message-history')
  async handleMessageHistory(socket: Socket, payload: { chatId: string, limit: number, offset: number }) {
    // console.log(socket.handshake)
    const { chatId, offset } = payload;
    let { limit } = payload;
    if (limit > 20 || limit < 1) limit = 20;
    const { username, role } = socket.handshake.auth.userCred as { username: string, role: string };
    // console.log("handle history", userCred);
    const messageHistory = await this.messageService.getMessageHistory(username, chatId, limit, offset);
    console.log(messageHistory);
    socket.emit('message-history-response', { messageHistory, chatId })
  }
}
