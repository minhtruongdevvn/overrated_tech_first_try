import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { AllConfigType, AppConfig } from 'src/configs';
import { UsersModule } from 'src/users/users.module';
import { ElasticSearchCommand } from './elastic-search.command';
import { ElasticSearchQuery } from './elastic-search.query';

@Global()
@Module({
  providers: [ElasticSearchCommand, ElasticSearchQuery],
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: async (configService: ConfigService<AllConfigType>) => {
        const appConfig: AppConfig = configService.getOrThrow('app');
        return { node: appConfig.elasticSearchNode };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
})
export class ElasticSearchModule {}
