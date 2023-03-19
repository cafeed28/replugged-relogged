import { messageStore } from "../webpack";
import { messageCache } from "../messageCache";
import type { Action, ActionHook } from "../types";

interface MessageDeleteBulkAction extends Action {
  ids: string[];
  channelId: string;
  guildId: string;
}

export default {
  type: "MESSAGE_DELETE_BULK",
  callback: (action: MessageDeleteBulkAction): boolean => {
    for (const id of action.ids) {
      const cachedMessage = messageCache.getCachedMessage(id);
      const discordMessage = messageStore.getMessage(action.channelId, id);

      const message = cachedMessage || discordMessage;

      if (message) {
        messageCache.setDeletedMessage(message.id, message);
      }
    }

    return true;
  },
} as ActionHook;
