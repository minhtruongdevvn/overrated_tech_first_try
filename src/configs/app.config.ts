/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.type';

export default registerAs<AppConfig>('app', () => ({
  cacheHost: process.env.REDIS_CACHE_HOST!,
  cachePort: Number(process.env.REDIS_CACHE_PORT!)!,
  elasticSearchNode: process.env.ELASTIC_SEARCH_NODE!,
}));
