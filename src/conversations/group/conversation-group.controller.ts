import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/common';

import { CreateConversationGroupDto } from '../dto/create-conversation-group.dto';
import { UpdateConversationGroupDto } from '../dto/update-conversation-group.dto';
import { ConversationGroupService } from './conversation-group.service';

@Controller('conversations/group')
@UseGuards(AuthGuard)
export class ConversationGroupController {
  constructor(private readonly convoGroupService: ConversationGroupService) {}

  @Get()
  getByUser(
    @GetUser('id') userId: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.convoGroupService.getByUser(userId, skip, take);
  }

  @Get(':id/members')
  getMembers(@GetUser('id') userId: number, @Param('id') id: number) {
    return this.convoGroupService.getMember(userId, id);
  }

  @Post()
  create(
    @GetUser('id') userId: number,
    @Body() dto: CreateConversationGroupDto,
  ) {
    return this.convoGroupService.create(userId, dto);
  }

  @Post(':id/members/:memberId')
  addMember(
    @GetUser('id') userId: number,
    @Param('id') id: number,
    @Param('memberId') memberId: number,
  ) {
    return this.convoGroupService.addMember(userId, memberId, id);
  }

  @Put(':id')
  update(
    @GetUser('id') userId: number,
    @Body() dto: UpdateConversationGroupDto,
    @Param('id') id: number,
  ) {
    return this.convoGroupService.update(id, userId, dto);
  }
}
