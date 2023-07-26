/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { registerAs } from '@nestjs/config';
import { SecurityConfig } from './config.type';

export default registerAs<SecurityConfig>('security', () => ({
  atSecret: process.env.AT_SECRET!,
  atExpiration: process.env.AT_EXPIRATION,
  bcryptSaltOrRound: 10,
}));
