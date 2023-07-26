import { BaseEntity } from 'src/common';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
