import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { OnEvent } from '@nestjs/event-emitter';
import { Conversation as ConversationEntity } from 'src/conversations/entities/conversation.entity';
import { Message as MessageEntity } from 'src/conversations/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { ConversationEvent, MessageEvent, UserEvent } from '../common';
import { Index } from './indexes';

@Injectable()
export class ElasticSearchCommand {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @OnEvent(UserEvent.Events.CREATED)
  @OnEvent(UserEvent.Events.UPDATED)
  async userUpsert(user: User) {
    await this.elasticsearchService.index({
      id: user.id.toString(),
      index: Index.USER,
      document: user,
    });
  }

  @OnEvent(UserEvent.Events.DELETED)
  async userDelete(userId: number) {
    await this.elasticsearchService.delete({
      index: Index.USER,
      id: userId.toString(),
    });
  }

  @OnEvent(MessageEvent.Events.CREATED)
  async messageUpsert(msg: MessageEntity) {
    await this.elasticsearchService.index({
      id: msg.id.toString(),
      index: Index.MSG,
      document: msg,
    });
  }

  @OnEvent(ConversationEvent.Events.CREATED)
  async messageCreate(convo: ConversationEntity) {
    await this.elasticsearchService.index({
      id: convo.id.toString(),
      index: Index.CONVERSATION,
      document: convo,
    });
  }
}
