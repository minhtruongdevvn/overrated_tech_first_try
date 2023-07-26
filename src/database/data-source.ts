import 'reflect-metadata';
import { loadDbConfig } from 'src/utils';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  ...loadDbConfig(process.env),
  entities: ['src/**/entities/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
