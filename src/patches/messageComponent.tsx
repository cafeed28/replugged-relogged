import { webpack } from "replugged";
import type { MessageProps } from "../types";

import { injector, logger } from "../utils";
import { messageCache } from "../messageCache";

type MessageModule = Record<string, React.FC<MessageProps>>;

export const patchMessageComponent = async (): Promise<void> => {
  const mod = (
    await webpack.waitForModule(webpack.filters.bySource('"childrenExecutedCommand"'), {
      raw: true,
    })
  ).exports as MessageModule;

  const renderFnName = webpack.getFunctionKeyBySource(mod, '"childrenExecutedCommand"');
  if (!renderFnName) {
    throw new Error("Cannot find message component render function");
  }

  injector.before(mod, renderFnName, ([props]) => {
    const childrenContentProps = props.childrenMessageContent.props;

    if (!childrenContentProps.message) {
      logger.error("childrenContentProps.message is undefined!");
      logger.log("Full props for debugging");
      logger.log(props);
      debugger;
      return;
    }

    const deletedMessage = messageCache.getDeletedMessage(childrenContentProps.message.id);

    if (deletedMessage) {
      props.className += " messageDeleted";
    }
  });
};
