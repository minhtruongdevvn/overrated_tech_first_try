import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/common';
import { FriendsService } from './friends.service';

@Controller('friends')
@UseGuards(AuthGuard)
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}

  @Post('to/:userId')
  addFriend(@GetUser('id') user1Id: number, @Param('userId') user2Id: number) {
    return this.friendService.addFriend(user1Id, user2Id);
  }

  @Get()
  getByUser(
    @GetUser('id') userId: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.friendService.getFriendByUser(userId, skip, take);
  }
}
