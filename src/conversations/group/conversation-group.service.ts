import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ClientException, clientError } from 'src/utils/exception';
import { In, Repository } from 'typeorm';
import { CreateConversationGroupDto } from '../dto/create-conversation-group.dto';
import { UpdateConversationGroupDto } from '../dto/update-conversation-group.dto';
import { Conversation } from '../entities/conversation.entity';
import { ensureUserBelongToGroup } from '../utils';

@Injectable()
export class ConversationGroupService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getByUser(userId: number, skip?: number, take?: number) {
    return this.conversationRepo
      .createQueryBuilder('conversation')
      .where('conversation.type = :type', { type: false })
      .andWhere(':userId = ANY(conversation.members)', { userId })
      .skip(skip)
      .take(take)
      .getMany();
  }

  async create(userId: number, dto: CreateConversationGroupDto) {
    const convo = this.conversationRepo.create({
      ...dto,
      type: false,
      members: [userId],
    });
    await convo.save();

    return convo;
  }

  async update(id: number, userId: number, dto: UpdateConversationGroupDto) {
    const convo = await this.conversationRepo.findOne({
      where: { id, members: userId, type: false },
    });

    if (!convo) throw new ClientException(clientError.NOT_FOUND);

    return await this.conversationRepo.save({ ...convo, ...dto });
  }

  async addMember(userId: number, memberId: number, convoId: number) {
    if (memberId == userId)
      throw new ClientException('UNPROCESSABLE_ENTITY', 'cannot add yourself');

    const isMemberExist = await this.userRepo.exist({
      where: { id: memberId },
    });

    if (!isMemberExist)
      throw new ClientException('NOT_FOUND', 'member is not exist');

    await ensureUserBelongToGroup(this.conversationRepo, convoId, userId);

    const updateResult = await this.conversationRepo
      .createQueryBuilder('conversation')
      .update(Conversation)
      .set({
        members: () =>
          `(CASE WHEN '${memberId}' = ANY(members) THEN members ELSE array_append(members, '${memberId}') END)`,
      })
      .where({ id: convoId })
      .execute();

    return updateResult.affected > 0;
  }

  async getMember(userId: number, convoId: number) {
    const convo = await this.conversationRepo
      .createQueryBuilder('conversation')
      .where('conversation.id = :convoId', { convoId })
      .andWhere(':userId = ANY(conversation.members)', { userId })
      //.select('conversation.members', 'members') //todo: clarify
      .getOne();

    if (!convo) throw new ClientException('NOT_FOUND');

    const { members } = convo;
    return await this.userRepo.find({
      where: { id: In(members.filter((e) => e != userId)) },
    });
  }
}
