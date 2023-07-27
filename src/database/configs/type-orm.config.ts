import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType, DatabaseConfig } from 'src/configs';

@Injectable()
export class TypeORMConfig implements TypeOrmOptionsFactory {
  private readonly configs: DatabaseConfig;
  constructor(configService: ConfigService<AllConfigType>) {
    this.configs = configService.getOrThrow('database');
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configs.host,
      port: this.configs.port,
      username: this.configs.username,
      password: this.configs.password,
      database: this.configs.database,
      synchronize: this.configs.synchronize,
      keepConnectionAlive: true,
      logging: false,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    };
  }
}
