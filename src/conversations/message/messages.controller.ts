import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser, MessageEvent } from 'src/common';
import { AddMessageDto } from '../dto/add-message.dto';
import { MessagesService } from './messages.service';

@Controller('conversations/messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(
    private readonly msgService: MessagesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async addMessageToConvo(
    @GetUser('id') id: number,
    @Body() dto: AddMessageDto,
  ) {
    const msg = await this.msgService.addMessageToConvo(id, dto);
    this.eventEmitter.emit(MessageEvent.Events.CREATED, msg);

    return msg;
  }

  @Get('/by/:id')
  getMessageByConvo(
    @GetUser('id') userId: number,
    @Param('id') id: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.msgService.getMessageByConvo(userId, id, skip, take);
  }

  @Get('/by/:id/me')
  getMessageByUser(
    @GetUser('id') userId: number,
    @Param('id') id: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.msgService.getMessageByUser(userId, id, skip, take);
  }
}
