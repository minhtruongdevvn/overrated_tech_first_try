import { registerAs } from '@nestjs/config';
import { loadDbConfig } from 'src/utils';
import { DatabaseConfig } from './config.type';

export default registerAs<DatabaseConfig>('database', () =>
  loadDbConfig(process.env),
);
