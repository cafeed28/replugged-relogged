import type { Action, ActionHook, Message } from "../types";

interface MessageUpdateAction extends Action {
  message: Message;
  guildId: string;
}

export default {
  type: "MESSAGE_UPDATE",
  callback: (_action: MessageUpdateAction): boolean => {
    // TODO: implement
    return false;
  },
} as ActionHook;
