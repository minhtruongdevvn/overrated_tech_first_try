const loadDbConfig = (env: { [key: string]: string }) => ({
  type: 'postgres' as const,
  host: env.DB_HOST,
  port: Number(env.DB_PORT) ?? 5432,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
});

export { loadDbConfig };
