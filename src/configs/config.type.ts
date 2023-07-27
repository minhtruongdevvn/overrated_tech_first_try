export interface DatabaseConfig {
  host: string;
  port: number;
  password: string;
  database: string;
  username: string;
  synchronize?: boolean;
  logging?: boolean;
}

export interface AppConfig {
  cacheHost: string;
  cachePort: number;
}

export interface SecurityConfig {
  atSecret: string;
  atExpiration?: string;
  bcryptSaltOrRound: string | number;
}

export interface AllConfigType {
  app: AppConfig;
  database: DatabaseConfig;
  security: SecurityConfig;
}
