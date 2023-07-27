import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/common';
import { TransformResponseInterceptor } from 'src/utils/interceptors';
import { User } from './entities/user.entity';
import { UserResponse } from './responses/user.reponse';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('nearby')
  @TransformResponseInterceptor(UserResponse)
  getNearbyUsers(@GetUser() user: User) {
    return this.userService.getUsersWithinRadius(user);
  }
}
