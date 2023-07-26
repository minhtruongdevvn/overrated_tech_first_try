import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
  TypeORMError,
} from 'typeorm';
import { ClientErrorResponse } from './client-error-response.type';
import { clientError } from './client-error.enum';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let isInternal = true;
    let errorMsg = '';

    switch (exception.constructor) {
      case QueryFailedError:
      case EntityNotFoundError:
      case CannotCreateEntityIdMapError:
        isInternal = false;

        // filter out unneeded info
        errorMsg =
          exception['detail']?.replace(/table|"\w+"|[. ]$|\(|\)/g, '').trim() ??
          '';
        break;
    }

    if (isInternal) {
      console.log(exception);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    const errResponse: ClientErrorResponse = {
      type: clientError.UNPROCESSABLE_ENTITY,
      description: errorMsg ?? undefined,
    };
    response.status(HttpStatus.BAD_REQUEST).json(errResponse);
  }
}
