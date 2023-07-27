import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(private readonly classConstructor: Type<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => instanceToPlain(this.addMetadata(item)));
        }
        return instanceToPlain(this.addMetadata(data));
      }),
    );
  }

  private addMetadata(data: any) {
    const dataWithMetadata = new this.classConstructor();
    Object.assign(dataWithMetadata, data);
    return dataWithMetadata;
  }
}

export const TransformResponseInterceptor = (classConstructor: Type<any>) =>
  UseInterceptors(new ResponseTransformInterceptor(classConstructor));
