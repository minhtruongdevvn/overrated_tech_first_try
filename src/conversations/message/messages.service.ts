import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddMessageDto } from '../dto/add-message.dto';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { ensureUserBelongToGroup } from '../utils';

export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly convoRepo: Repository<Conversation>,
  ) {}

  async addMessageToConvo(userId: number, dto: AddMessageDto) {
    await ensureUserBelongToGroup(this.convoRepo, dto.conversationId, userId);

    const msg = this.msgRepo.create({ ...dto, userId });
    await msg.save();

    return msg;
  }

  async getMessageByUser(
    userId: number,
    convoId: number,
    skip?: number,
    take?: number,
  ) {
    await ensureUserBelongToGroup(this.convoRepo, convoId, userId);

    return await this.msgRepo.find({
      where: { conversationId: convoId, userId },
      skip,
      take,
    });
  }

  async getMessageByConvo(
    userId: number,
    convoId: number,
    skip?: number,
    take?: number,
  ) {
    await ensureUserBelongToGroup(this.convoRepo, convoId, userId);

    return await this.msgRepo.find({
      where: { conversationId: convoId },
      skip,
      take,
    });
  }
}
