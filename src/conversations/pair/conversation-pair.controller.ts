import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ConversationEvent, GetUser } from 'src/common';
import { UpdateConversationPairDto } from '../dto/update-conversation-pair.dto';
import { ConversationPairService } from './conversation-pair.service';

@Controller('conversations/pair')
@UseGuards(AuthGuard)
export class ConversationPairController {
  constructor(
    private readonly convoPairService: ConversationPairService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('me')
  getByUser(
    @GetUser('id') userId: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.convoPairService.getByUser(userId, skip, take);
  }

  @Get()
  async getByName(@Query('name') name?: string) {
    const results: any[] = await this.eventEmitter.emitAsync(
      ConversationEvent.Events.GET,
      name,
    );

    return results?.[0];
  }

  @Get('to/:userId')
  async getOrCreate(
    @GetUser('id') user1Id: number,
    @Param('userId') user2Id: number,
  ) {
    const convo = await this.convoPairService.getOrCreate(user1Id, user2Id);
    this.eventEmitter.emit(ConversationEvent.Events.CREATED, convo);

    return convo;
  }

  @Put(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id') convoId: number,
    @Body() dto: UpdateConversationPairDto,
  ) {
    return this.convoPairService.update(userId, convoId, dto);
  }
}
