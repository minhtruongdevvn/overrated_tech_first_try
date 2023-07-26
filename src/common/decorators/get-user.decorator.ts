import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/auth/entities/user.entity';
import { BaseEntity } from 'typeorm';

export const GetUser = createParamDecorator(
  (
    data: keyof Exclude<User, keyof typeof BaseEntity> | undefined | null,
    ctx: ExecutionContext,
  ) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    return data ? user?.[data] : user;
  },
);
