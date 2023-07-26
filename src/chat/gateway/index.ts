import {
  ClassSerializerInterceptor,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesService } from 'src/conversations/message';
import { ChatService } from '../chat.service';
import { getAccessTokenFromSocket } from '../utils';
import { validationOptions } from '../utils/validation-options';
import { WsExceptionFilter } from './exception.filter';
import { ChatSocket, ChatSocketServer, Emitter, Listener } from './types';

@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe(validationOptions)) // todo: test and change
@UseFilters(new WsExceptionFilter())
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly msgService: MessagesService,
    private chatService: ChatService,
  ) {}

  afterInit = (server: ChatSocketServer) => this.chatService.setServer(server);

  async handleConnection(client: ChatSocket) {
    const userId = getAccessTokenFromSocket(client);
    const conversationId = Number(client.handshake.query.conversationId);

    if (!conversationId || !userId) {
      client.disconnect(true);
      return;
    }

    const isConvoExist = await this.chatService.getConvoExist(
      conversationId,
      userId,
    );

    if (!isConvoExist) {
      client.disconnect(true);
      return;
    }

    client.data = { ...client.data, conversationId, userId };

    const roomId = conversationId.toString();
    await client.join(roomId);

    const activeUserIds = await this.chatService.getActiveUserIdsById(
      conversationId,
      userId,
    );

    client.emit(Emitter.User.Events.CONNECTED, { activeUserIds });
    client.broadcast
      .to(roomId)
      .emit(Emitter.User.Events.JOINED_CHAT, { userId });
  }

  handleDisconnect(client: ChatSocket) {
    if (!client.data.userId) return;
    client.broadcast.emit(Emitter.User.Events.LEFT_CHAT, {
      userId: client.data.userId,
    });
  }

  @SubscribeMessage(Listener.Message.Events.SEND)
  async messageSend(
    @MessageBody() { message }: Listener.Message.Payload.Send,
    @ConnectedSocket() client: ChatSocket,
  ) {
    const { userId, conversationId } = client.data;
    if (!userId || !conversationId) return;

    const newlyCreatedMessage = await this.msgService.addMessageToConvo(
      userId,
      { conversationId, message },
    );

    client.broadcast
      .to(conversationId.toString())
      .emit(Emitter.Message.Events.RECEIVED, newlyCreatedMessage);
  }

  @SubscribeMessage(Listener.User.Events.TYPE)
  async userType(@ConnectedSocket() client: ChatSocket) {
    const { userId, conversationId } = client.data;
    if (!userId || !conversationId) return;

    client.broadcast
      .to(conversationId.toString())
      .emit(Emitter.User.Events.TYPE, { userId });
  }

  @SubscribeMessage(Listener.User.Events.END_TYPE)
  async userEndType(@ConnectedSocket() client: ChatSocket) {
    const { userId, conversationId } = client.data;
    if (!userId || !conversationId) return;

    client.broadcast
      .to(conversationId.toString())
      .emit(Emitter.User.Events.END_TYPE, { userId });
  }
}
