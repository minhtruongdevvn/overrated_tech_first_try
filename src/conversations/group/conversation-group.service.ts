import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ClientException, clientError } from 'src/utils/exception';
import { Repository } from 'typeorm';
import { CreateConversationGroupDto } from '../dto/create-conversation-group.dto';
import { UpdateConversationGroupDto } from '../dto/update-conversation-group.dto';
import { Conversation } from '../entities/conversation.entity';

@Injectable()
export class ConversationGroupService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getByUser(userId: number, skip?: number, take?: number) {
    return this.conversationRepo.find({
      where: { type: false, members: userId },
      skip,
      take,
    });
  }

  async create(dto: CreateConversationGroupDto) {
    const { creatorId, ...convoDto } = dto;
    const convo = this.conversationRepo.create({
      ...convoDto,
      type: false,
      members: [creatorId],
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
    const isMemberExist = await this.userRepo.exist({
      where: { id: memberId },
    });

    if (!isMemberExist)
      throw new ClientException('NOT_FOUND', 'member is not exist');

    const isUserAuthorized = await this.conversationRepo.exist({
      where: { members: userId },
    });

    if (!isUserAuthorized)
      throw new ClientException('UNPROCESSABLE_ENTITY', 'not belong to group');

    const updateResult = await this.conversationRepo
      .createQueryBuilder('conversation')
      .update(Conversation)
      .set({
        members: () =>
          `(CASE WHEN '${memberId}' = ANY(my_array) THEN my_array ELSE array_append(my_array, '${memberId}') END)`,
      })
      .where({ id: convoId })
      .execute();

    return updateResult.affected > 0;
  }
}
