import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './configs/database.config';
import securityConfig from './configs/security.config';
import { ConversationsModule } from './conversations/conversations.module';
import { DatabaseModule } from './database/database.module';
import { FriendsModule } from './friends/friends.module';
import { TypeORMExceptionFilter } from './utils/exception';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [databaseConfig, securityConfig],
      isGlobal: true,
    }),
    ConversationsModule,
    AuthModule,
    FriendsModule,
    UsersModule,
    ChatModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: TypeORMExceptionFilter }],
})
export class AppModule {}
