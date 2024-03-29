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
import { ConversationEvent, GetUser } from 'src/common';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateConversationGroupDto } from '../dto/create-conversation-group.dto';
import { UpdateConversationGroupDto } from '../dto/update-conversation-group.dto';
import { ConversationGroupService } from './conversation-group.service';

@Controller('conversations/group')
@UseGuards(AuthGuard)
export class ConversationGroupController {
  constructor(
    private readonly convoGroupService: ConversationGroupService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('me')
  getByUser(
    @GetUser('id') userId: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.convoGroupService.getByUser(userId, skip, take);
  }

  @Get()
  async getByName(@Query('name') name?: string) {
    const results: any[] = await this.eventEmitter.emitAsync(
      ConversationEvent.Events.GET,
      name,
    );

    return results?.[0];
  }

  @Get(':id/members')
  getMembers(@GetUser('id') userId: number, @Param('id') id: number) {
    return this.convoGroupService.getMember(userId, id);
  }

  @Post()
  async create(
    @GetUser('id') userId: number,
    @Body() dto: CreateConversationGroupDto,
  ) {
    const convo = await this.convoGroupService.create(userId, dto);
    this.eventEmitter.emit(ConversationEvent.Events.CREATED, convo);

    return convo;
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
