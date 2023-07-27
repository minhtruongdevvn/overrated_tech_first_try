import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/common';
import { TransformResponseInterceptor } from 'src/common/interceptors';
import { UserEvent } from '../common';
import { User } from './entities/user.entity';
import { UserResponse } from './responses/user.response';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('nearby')
  @TransformResponseInterceptor(UserResponse)
  getNearbyUsers(@GetUser() user: User) {
    return this.userService.getUsersWithinRadius(user);
  }

  @Get()
  async getUsers(@Query('id') id?: number, @Query('name') name?: string) {
    const result: any[] = await this.eventEmitter.emitAsync(
      UserEvent.Events.GET,
      {
        id,
        name,
      },
    );

    return result?.[0];
  }
}
