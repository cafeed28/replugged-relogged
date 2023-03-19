import { webpack } from "replugged";
import type { StoreMessage } from "./types";

export const messageStore = await webpack.waitForModule<{
  getMessage: (channelId: string, id: string) => StoreMessage | undefined;
}>(webpack.filters.byProps("getMessage", "getMessages"));
