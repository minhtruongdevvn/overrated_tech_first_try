import { ClientException } from 'src/common/exception';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';

export const ensureUserBelongToGroup = async (
  repo: Repository<Conversation>,
  convoId: number,
  userId: number,
) => {
  const isUserAuthorized = await repo
    .createQueryBuilder('conversation')
    .where('conversation.id = :convoId', { convoId })
    .andWhere(':userId = ANY(conversation.members)', { userId })
    .getExists();

  if (!isUserAuthorized)
    throw new ClientException('UNPROCESSABLE_ENTITY', 'not belong to group');
};
