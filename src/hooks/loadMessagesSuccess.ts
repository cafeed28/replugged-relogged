import { messageCache } from "../messageCache";
import type { Action, ActionHook, Message } from "../types";

// https://stackoverflow.com/a/53187807
function findLastIndex<T>(
  array: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean,
): number {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

interface LoadMessagesSuccessAction extends Action {
  channelId: string;
  limit: number;
  messages: Message[];

  hasMoreBefore: boolean;
  hasMoreAfter: boolean;

  isBefore: boolean;
  isAfter: boolean;
  isStale: boolean;
}

export default {
  type: "LOAD_MESSAGES_SUCCESS",
  callback: (action: LoadMessagesSuccessAction): boolean => {
    const isChannelStart = !action.hasMoreAfter && !action.isBefore;
    const isChannelEnd = !action.hasMoreBefore && !action.isAfter;

    const restoreAll = isChannelStart && isChannelEnd;

    const deletedMessages: Message[] = messageCache.getDeletedMessages(action.channelId);

    if (action.messages == null) return false;
    if (action.messages.length == 0 && !restoreAll) return false;

    if (deletedMessages == null || deletedMessages.length == 0) return false;

    const newestMessageId = isChannelStart ? 0 : BigInt(action.messages[0].id);
    const oldestMessageId = isChannelEnd ? 0 : BigInt(action.messages.slice(-1)[0].id);

    const oldestSavedIndex = isChannelEnd
      ? 0
      : deletedMessages.findIndex((m) => BigInt(m.id) > oldestMessageId);
    if (oldestSavedIndex == -1) return false;

    const newestSavedIndex = isChannelStart
      ? deletedMessages.length - 1
      : findLastIndex(deletedMessages, (m) => BigInt(m.id) < newestMessageId);
    if (newestSavedIndex == -1) return false;

    const restore = deletedMessages.slice(oldestSavedIndex, newestSavedIndex + 1);

    // Don't increase action.limit 'cause then discord will scroll messages on channel select
    action.messages = [...action.messages, ...restore].sort((a: Message, b: Message) => {
      return Number(BigInt(b.id) - BigInt(a.id));
    });

    return false;
  },
} as ActionHook;
