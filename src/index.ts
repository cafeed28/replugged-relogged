import { injector } from "./utils";

import { patchDispatcher } from "./patches/dispatch";
import { patchMessageComponent } from "./patches/messageComponent";

import "./styles.css";

export async function start(): Promise<void> {
  patchDispatcher();
  await patchMessageComponent();
}

export function stop(): void {
  injector.uninjectAll();
}
