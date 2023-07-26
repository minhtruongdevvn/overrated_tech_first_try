/* eslint-disable @typescript-eslint/no-non-null-assertion */
const loadDbConfig = (
  env: { [key: string]: string | undefined } | undefined,
) => {
  if (!env) throw new Error('cannot load config');

  return {
    type: 'postgres' as const,
    host: env.DB_HOST!,
    port: Number(env.DB_PORT) ?? 5432,
    password: env.DB_PASSWORD!,
    database: env.DB_NAME!,
    username: env.DB_USERNAME!,
    synchronize: env.NODE_ENV === 'development',
    logging: env.NODE_ENV === 'development',
  };
};

export { loadDbConfig };
