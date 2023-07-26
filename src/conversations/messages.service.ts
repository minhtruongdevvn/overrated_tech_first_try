import { InjectRepository } from '@nestjs/typeorm';
import { ClientException } from 'src/utils/exception';
import { Repository } from 'typeorm';
import { AddMessageDto } from './dto/add-message.dto';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly convoRepo: Repository<Conversation>,
  ) {}

  async addMessageToConvo(userId: number, dto: AddMessageDto) {
    const isUserAuthorized = await this.convoRepo.exist({
      where: { id: dto.conversationId, members: userId },
    });

    if (!isUserAuthorized)
      throw new ClientException(
        'UNPROCESSABLE_ENTITY',
        'user not belong to conversation',
      );

    const msg = this.msgRepo.create(dto);
    await msg.save();

    return msg;
  }

  async getMessageByConvo(
    userId: number,
    convoId: number,
    skip?: number,
    take?: number,
  ) {
    return this.msgRepo.find({
      where: { conversationId: convoId, userId },
      skip,
      take,
    });
  }
}
