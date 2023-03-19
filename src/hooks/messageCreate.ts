import { messageCache } from "../messageCache";
import type { Action, ActionHook, Message } from "../types";

interface MessageCreateAction extends Action {
  channelId: string;
  message: Message;
  optimistic: boolean;
  isPushNotification: boolean;
}

export default {
  type: "MESSAGE_CREATE",
  callback: (action: MessageCreateAction): boolean => {
    messageCache.setCachedMessage(action.message.id, action.message);
    return false;
  },
} as ActionHook;
