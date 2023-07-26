import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ClientException } from 'src/utils/exception';
import { Repository } from 'typeorm';
import { UpdateConversationPairDto } from '../dto/update-conversation-pair.dto';
import { Conversation } from '../entities/conversation.entity';

@Injectable()
export class ConversationPairService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  getByUser(userId: number, skip?: number, take?: number) {
    return this.conversationRepo
      .createQueryBuilder('conversation')
      .where('conversation.type = :type', { type: true })
      .andWhere(':userId = ANY(conversation.members)', { userId })
      .skip(skip)
      .take(take)
      .getMany();
  }

  getByRelation(user1Id: number, user2Id: number) {
    return this.conversationRepo
      .createQueryBuilder('conversation')
      .where('conversation.type = :type', { type: true })
      .andWhere(':user1Id = ANY(conversation.members)', { user1Id })
      .andWhere(':user2Id = ANY(conversation.members)', { user2Id })
      .getOne();
  }

  create(user1Id: number, user2Id: number) {
    const convo = this.conversationRepo.create({
      type: true,
      members: [user1Id, user2Id],
    });

    return convo.save();
  }

  async getOrCreate(user1Id: number, user2Id: number) {
    if (user1Id == user2Id)
      throw new ClientException(
        'UNPROCESSABLE_ENTITY',
        "you don't have friend with yourself",
      );

    let convo = await this.getByRelation(user1Id, user2Id);

    if (!convo) {
      convo = await this.create(user1Id, user2Id);
    }

    return convo;
  }

  async update(
    userId: number,
    convoId: number,
    dto: UpdateConversationPairDto,
  ) {
    const convo = await this.conversationRepo.findOne({
      where: { id: convoId, type: true, members: userId },
    });

    if (!convo) throw new ClientException('NOT_FOUND');

    return await this.conversationRepo.save({ ...convo, ...dto });
  }
}
