import { messageStore } from "./webpack";
import type { AnyMessage, Message, User } from "./types";

const TYPE_REPLY = 19;

const isRawMessage = (message: AnyMessage): message is Message => {
  // api message object: channel_id
  // discord store message object: channelId
  return "channel_id" in (message as Message);
};

const createUser = (user: User): User => {
  return {
    id: user.id,
    avatar: user.avatar,
    username: user.username,
    discriminator: user.discriminator,
    bot: user.bot,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public_flags: user.publicFlags || user.public_flags,
  };
};

// based on 1Lighty's MLV2
const createMessage = (message: AnyMessage): Message => {
  const result: Partial<Message> = {};

  result.referenced_message = null;

  if (isRawMessage(message)) {
    result.id = message.id;
    result.channel_id = message.channel_id;
    result.guild_id = message.guild_id;

    result.author = createUser(message.author);
    result.type = message.type;
    result.flags = message.flags;

    result.content = message.content;
    result.attachments = message.attachments || [];
    result.embeds = message.embeds || [];
    result.reactions = message.reactions || [];

    result.mentions = message.mentions || [];
    result.mention_roles = message.mention_roles || [];
    result.mention_everyone = message.mention_everyone || false;

    result.timestamp = message.timestamp;
    result.edited_timestamp = message.edited_timestamp;

    if (result.type == TYPE_REPLY) {
      result.message_reference = message.message_reference;
    }
  } else {
    result.id = message.id;
    result.channel_id = message.channel_id;
    result.guild_id = message.guild_id;

    result.author = createUser(message.author);
    result.type = message.type;
    result.flags = message.flags;

    result.content = message.content;
    result.attachments = message.attachments || [];
    result.embeds = message.embeds || [];
    result.reactions = message.reactions || [];

    result.mentions = message.mentions || [];
    result.mention_roles = message.mention_roles || [];
    result.mention_everyone = message.mention_everyone || false;

    result.timestamp = message.timestamp;
    result.edited_timestamp = message.editedTimestamp;

    if (result.type == TYPE_REPLY) {
      result.message_reference = message.messageReference;
    }
  }

  if (result.type == TYPE_REPLY && result.message_reference) {
    const messageReference = result.message_reference;
    const referencedMessage = messageStore.getMessage(
      messageReference.channel_id,
      messageReference.message_id,
    );

    if (referencedMessage) {
      result.referenced_message = createMessage(referencedMessage);
    }
  }

  // TODO: cleanup embeds

  return message as Message;
};

class MessageCache {
  private cachedMessages: Map<string, Message>;
  private deletedMessages: Map<string, Message>;

  public constructor() {
    this.cachedMessages = new Map();
    this.deletedMessages = new Map();
  }

  public getCachedMessage(id: string): Message | undefined {
    return this.cachedMessages.get(id);
  }

  public getDeletedMessage(id: string): Message | undefined {
    return this.deletedMessages.get(id);
  }

  public setCachedMessage(id: string, message: AnyMessage): void {
    this.cachedMessages.set(id, createMessage(message));
  }

  public setDeletedMessage(id: string, message: AnyMessage): void {
    this.deletedMessages.set(id, createMessage(message));
  }

  public getCachedMessages(channelId: string): Message[] {
    const messages: Message[] = [];

    this.cachedMessages.forEach((m) => {
      if (m.channel_id == channelId) messages.push();
    });

    return messages;
  }

  public getDeletedMessages(channelId: string): Message[] {
    const messages: Message[] = [];

    this.deletedMessages.forEach((m) => {
      if (m.channel_id == channelId) messages.push(m);
    });

    return messages;
  }
}

export const messageCache = new MessageCache();
