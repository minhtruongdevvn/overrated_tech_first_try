export const Events = {
  /** User connects to the server successfully. */
  CONNECTED: 'user_connected',
  /** User joins a conversation. */
  JOINED_CHAT: 'user_joined_chat',
  /** User typing a message. */
  TYPE: 'user_type_emitter',
  /** User typing a message. */
  END_TYPE: 'user_end_type_emitter',
  /** User leave chat. */
  LEFT_CHAT: 'user_left_chat',
} as const;
