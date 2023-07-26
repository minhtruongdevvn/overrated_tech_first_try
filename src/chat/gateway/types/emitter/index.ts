import { MapEventPayloadActions } from '../map-event-payload-actions.type';
import * as Message from './message';
import * as User from './user';

export type ChatSocketEmitter = MapEventPayloadActions<{
  [User.Events.CONNECTED]: User.Payload.Connected;
  [User.Events.JOINED_CHAT]: User.Payload.JoinedChat;
  [User.Events.TYPE]: User.Payload.Type;
  [User.Events.END_TYPE]: User.Payload.EndType;
  [User.Events.LEFT_CHAT]: User.Payload.LeftChat;

  [Message.Events.RECEIVED]: Message.Payload.Received;
}>;

export { Message, User };
