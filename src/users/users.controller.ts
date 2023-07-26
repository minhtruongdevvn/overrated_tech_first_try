import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('nearby')
  getNearbyUsers(@GetUser() user: User) {
    return this.userService.getUsersWithinRadius(user);
  }
}
