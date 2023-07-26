import { BaseEntity } from 'src/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Conversation extends BaseEntity {
  @Column('text', { nullable: true })
  name?: string;

  @Column('text', {
    default: 'https://cdn-icons-png.flaticon.com/512/666/666201.png',
  })
  avatar?: string;

  @Column('bigint', { nullable: true })
  lastMessageId?: number;

  /** true is pair, false is group */
  @Column()
  type: boolean;

  @Column('integer', { array: true })
  // @Index({ spatial: true }) //todo: consider indexing
  members: number[];

  @Column('text', {
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReLyRAfB8rBKl8AsfBciSq7OucaCorv8TP8iBPyd7a&s',
  })
  background: string;

  @Column('int', { nullable: true })
  status?: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  lastActivity: number;

  @OneToMany(() => Message, (msg) => msg.conversation)
  messages: Message[];
}
