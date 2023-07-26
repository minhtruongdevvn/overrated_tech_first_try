export interface DatabaseConfig {
  host: string;
  port: number;
  password: string;
  database: string;
  username: string;
  synchronize?: boolean;
  logging?: boolean;
}

export interface SecurityConfig {
  atSecret: string;
  atExpiration?: string;
  bcryptSaltOrRound: string | number;
}

export interface AllConfigType {
  database: DatabaseConfig;
  security: SecurityConfig;
}
