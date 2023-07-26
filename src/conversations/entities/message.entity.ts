import { User } from 'src/auth/entities/user.entity';
import { BaseEntity } from 'src/common';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  RelationId,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity()
export class Message extends BaseEntity {
  @Column('bigint')
  @RelationId((message: Message) => message.conversation)
  conversationId: number;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column('text')
  message: string;

  @Column('int', { nullable: true })
  status: number;

  @Column('bigint')
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
