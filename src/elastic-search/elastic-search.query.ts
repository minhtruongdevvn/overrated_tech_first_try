import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { OnEvent } from '@nestjs/event-emitter';
import { UsersService } from 'src/users/users.service';
import { ConversationEvent, MessageEvent, UserEvent } from '../common';
import { Index } from './indexes';

@Injectable()
export class ElasticSearchQuery implements OnApplicationBootstrap {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly userService: UsersService,
  ) {}

  @OnEvent(UserEvent.Events.GET)
  async getUsers(query: UserEvent.Payload.GetUserQuery) {
    const { id, name } = query;

    const should: QueryDslQueryContainer[] = [];
    id && should.push({ match: { id: { query: id.toString() } } });
    name && should.push({ wildcard: { name: { value: `*${name}*` } } });

    id && { match: { id: { query: id.toString() } } };
    const res = await this.elasticsearchService.search({
      index: Index.USER,
      query: {
        bool: {
          should: should.length == 0 ? undefined : should,
        },
      },
    });

    let users: any[] = res.hits.hits.map((e) => e._source);

    if (!users || users.length == 0) {
      users = await this.userService.getUser(query);

      if (users.length > 0) {
        await this.elasticsearchService.bulk({
          index: Index.USER,
          operations: users.map((e) => ({
            update: { _id: e.id },
            doc: e,
            doc_as_upsert: true,
          })),
        });
      }
    }

    return users;
  }

  @OnEvent(ConversationEvent.Events.GET)
  async getConversations(nameLike?: string) {
    return this.elasticsearchService.search({
      index: Index.CONVERSATION,
      query: {
        wildcard: { name: nameLike ? `*${nameLike}*` : undefined },
      },
    });
  }

  @OnEvent(MessageEvent.Events.GET)
  async getMessages(message?: string) {
    await this.elasticsearchService.search({
      index: Index.MSG,
      query: {
        wildcard: { message: message ? `*${message}*` : undefined },
      },
    });
  }

  async onApplicationBootstrap() {
    await Promise.all(
      Object.values(Index).map((e) =>
        this.elasticsearchService.indices
          .create({ index: e })
          .catch(() => console.log(`Index ${e} is cancelled`)),
      ),
    );
  }
}
