export const clientError = {
  /** not found something that is expected to be found */
  NOT_FOUND: 'NOT_FOUND',
  /** client request data invalid */
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
  /** client request with valid data, but the data is unprocessable base on app logic*/
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
  /** something existed that is expected not to exist */
  EXISTED: 'EXISTED',
} as const;

export type ClientError = keyof typeof clientError;
