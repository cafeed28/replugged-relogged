import { messageStore } from "../webpack";
import { messageCache } from "../messageCache";
import type { Action, ActionHook } from "../types";

const FLAG_EPHEMERAL = 64;

interface MessageDeleteAction extends Action {
  id: string;
  channelId: string;
  guildId?: string; // undefined when local deleteMessage
}

export default {
  type: "MESSAGE_DELETE",
  callback: (action: MessageDeleteAction): boolean => {
    const cachedMessage = messageCache.getCachedMessage(action.id);
    const discordMessage = messageStore.getMessage(action.channelId, action.id);

    const message = cachedMessage || discordMessage;

    // flags is undefined in cached message
    if (discordMessage && discordMessage.flags == FLAG_EPHEMERAL) return false;

    if (message) {
      messageCache.setDeletedMessage(message.id, message);
      // TODO: fix force updating
      // util.forceUpdateElement(`#chat-messages-${action.channelId}-${action.id}`, true);
    }

    return true;
  },
} as ActionHook;
