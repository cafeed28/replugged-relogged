/* eslint-disable @typescript-eslint/naming-convention */
import { EmbedJSON, MessageAttachment, MessageJSON } from "discord-types/general";
import { MessageReference } from "replugged/dist/renderer/modules/common/messages";

export type Nullable<T> = T | null;

export interface Action {
  type: string;
}

type ActionTypes =
  | "MESSAGE_CREATE"
  | "MESSAGE_DELETE"
  | "MESSAGE_DELETE_BULK"
  | "MESSAGE_UPDATE"
  | "LOAD_MESSAGES_SUCCESS";

export interface ActionHook {
  type: ActionTypes;
  callback: (action: Action) => boolean;
}

export interface User {
  id: string;
  avatar: string;
  username: string;
  discriminator: string;
  bot: boolean;

  // discord moment idk
  publicFlags?: number;
  public_flags?: number;
}

export interface Message
  extends Omit<MessageJSON, "message_reference" | "referenced_message" | "author" | "mentions"> {
  author: User;
  reactions: unknown[];
  mentions: string[];

  message_reference: Nullable<MessageReference>;
  referenced_message: Nullable<Message>;

  // custom
  edits?: Message[];
}

// discord why
export interface StoreMessage {
  id: string;
  channel_id: string;
  guild_id: string;

  author: User;
  type: number;
  flags: number;

  content: string;
  attachments: MessageAttachment[];
  embeds: EmbedJSON[];
  reactions: unknown[];

  mentions: string[];
  mention_roles: string[];
  mention_everyone: boolean;

  timestamp: string;
  editedTimestamp: string;

  messageReference: Nullable<MessageReference>;
}

export type AnyMessage = Message | StoreMessage;

export interface MessageContentProps {
  className?: string;
  children?: React.ReactNode;

  content: string[];
  message: Message;
}

export interface MessageProps {
  className: string;

  childrenHighlight: React.Component;
  childrenRepliedMessage: React.Component;
  childrenExecutedCommand?: React.Component;
  childrenHeader: React.Component;
  childrenSystemMessage?: React.Component;
  childrenButtons: React.Component;
  childrenMessageContent: React.Component<MessageContentProps>;
  childrenAccessories: React.Component;

  messageRef?: unknown;
  focusProps?: unknown;

  disableInteraction?: boolean;
  compact: boolean;
  hasReply: boolean;
  hasThread: boolean;
  isSystemMessage: boolean;
  zalgo: boolean;
}
