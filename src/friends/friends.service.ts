import { Injectable } from '@nestjs/common';
import { ConversationPairService } from 'src/conversations/pair';
import { ClientException } from 'src/utils/exception';

@Injectable()
export class FriendsService {
  constructor(private readonly convoPairService: ConversationPairService) {}

  async addFriend(user1Id: number, user2Id: number) {
    const convo = await this.convoPairService.getByRelation(user1Id, user2Id);

    if (convo) {
      throw new ClientException('EXISTED', 'already friend');
    }

    return await this.convoPairService.create(user1Id, user2Id);
  }

  getFriendByUser(userId: number, skip?: number, take?: number) {
    this.convoPairService.getByUser(userId, skip, take);
  }
}
