import { MapEventPayloadActions } from '../map-event-payload-actions.type';
import * as Message from './message';
import * as User from './user';

export type ChatSocketListener = MapEventPayloadActions<{
  [User.Events.TYPE]: undefined;
  [User.Events.END_TYPE]: undefined;

  [Message.Events.SEND]: Message.Payload.Send;
}>;
export { Message, User };
