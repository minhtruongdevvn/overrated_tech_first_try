import {
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ClientException, clientError } from 'src/common/exception';

export const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  exceptionFactory: (errors: ValidationError[]) => {
    return new ClientException(
      clientError.INVALID_PAYLOAD,
      errors.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.property]: Object.values(curr.constraints ?? {}).join(', '),
        }),
        {},
      ),
    );
  },
};
