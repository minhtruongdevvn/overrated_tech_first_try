import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oauth } from 'src/auth/entities/oauth.entity';
import { User } from 'src/users/entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ConversationGroupController, ConversationGroupService } from './group';
import { MessagesController, MessagesService } from './message';
import { ConversationPairController, ConversationPairService } from './pair';

@Module({
  imports: [TypeOrmModule.forFeature([User, Conversation, Message, Oauth])],
  controllers: [
    ConversationGroupController,
    ConversationPairController,
    MessagesController,
  ],
  providers: [
    ConversationGroupService,
    ConversationPairService,
    MessagesService,
  ],
  exports: [ConversationPairService, MessagesService],
})
export class ConversationsModule {}
