import { Message } from 'src/conversations/entities/message.entity';

export type Received = Pick<Message, 'userId' | 'id' | 'message'>;
