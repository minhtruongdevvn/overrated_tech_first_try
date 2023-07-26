import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './gateway';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Conversation]),
    ConversationsModule,
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
