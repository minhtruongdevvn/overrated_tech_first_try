import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { Repository } from 'typeorm';
import { ChatSocketServer } from './gateway/types';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly convoRepo: Repository<Conversation>,
  ) {}
  private server: ChatSocketServer;

  setServer = (server: ChatSocketServer) => (this.server = server);

  getConvoExist(id: number, userId: number) {
    return this.convoRepo
      .createQueryBuilder('conversation')
      .where('conversation.id = :id', { id })
      .andWhere(':userId = ANY(conversation.members)', { userId })
      .getExists();
  }

  async getActiveUserIdsById(id: number, exclude?: number) {
    const room = this.server.sockets.adapter.rooms?.get(id.toString());
    if (!room) return [];

    const sockets: Map<string, any> = this.server.sockets['sockets'];

    const users = new Set<number>();
    for (const clientId of Array.from(room)) {
      const socket = sockets.get(clientId);
      if (!socket || !socket.data.userId || socket.data.userId == exclude)
        continue;

      users.add(socket.data.userId);
    }

    return Array.from(users);
  }

  countActiveUsersById(id: number) {
    const room = this.server.sockets.adapter.rooms?.get(id.toString());
    if (!room) return 0;

    return room.size;
  }
}
