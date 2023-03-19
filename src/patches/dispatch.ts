import { common } from "replugged";
const { fluxDispatcher } = common;

import { injector } from "../utils";
import hooks from "../hooks";

export const patchDispatcher = (): void => {
  injector.instead(fluxDispatcher, "dispatch", ([action], orig, self): Promise<void> => {
    for (const hook of hooks) {
      if (action.type == hook.type) {
        if (hook.callback(action)) return Promise.resolve();
      }
    }

    return Promise.resolve(orig.call(self, action));
  });
};
