import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from './configs/type-orm.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfig,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
