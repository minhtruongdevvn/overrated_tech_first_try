import { ClientError } from './client-error.enum';

export interface ClientErrorResponse {
  type: ClientError;
  description?: object | string;
}
