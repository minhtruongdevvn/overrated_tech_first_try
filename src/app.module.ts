import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { TypeORMExceptionFilter } from './common/exception';
import { AllConfigType, AppConfig } from './configs';
import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';
import securityConfig from './configs/security.config';
import { ConversationsModule } from './conversations/conversations.module';
import { DatabaseModule } from './database/database.module';
import { ElasticSearchModule } from './elastic-search/elastic-search.module';
import { FriendsModule } from './friends/friends.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [databaseConfig, securityConfig, appConfig],
      isGlobal: true,
    }),
    ConversationsModule,
    AuthModule,
    FriendsModule,
    UsersModule,
    ChatModule,
    ElasticSearchModule,
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (config: ConfigService<AllConfigType>) => {
        const appConfig: AppConfig = config.getOrThrow('app', { infer: true });
        const store = await redisStore({
          socket: {
            host: appConfig.cacheHost,
            port: appConfig.cachePort,
          },
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
  ],
  providers: [
    { provide: APP_FILTER, useClass: TypeORMExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
