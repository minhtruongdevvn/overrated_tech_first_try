import { Module } from '@nestjs/common';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [ConversationsModule],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
