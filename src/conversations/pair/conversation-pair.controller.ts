import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/common';
import { UpdateConversationPairDto } from '../dto/update-conversation-pair.dto';
import { ConversationPairService } from './conversation-pair.service';

@Controller('conversations/pair')
@UseGuards(AuthGuard)
export class ConversationPairController {
  constructor(private readonly convoGroupService: ConversationPairService) {}

  @Get()
  getByUser(
    @GetUser('id') userId: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.convoGroupService.getByUser(userId, skip, take);
  }

  @Get('to/:userId')
  getOrCreate(
    @GetUser('id') user1Id: number,
    @Param('userId') user2Id: number,
  ) {
    return this.convoGroupService.getOrCreate(user1Id, user2Id);
  }

  @Put(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id') convoId: number,
    @Body() dto: UpdateConversationPairDto,
  ) {
    return this.convoGroupService.update(userId, convoId, dto);
  }
}
