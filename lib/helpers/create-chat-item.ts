import { ChatUserstate } from "tmi.js";
import { createBadges } from "./create-badges";
import { createDisplayName } from "./create-display-name";
import { createMessage } from "./create-message";
import { createPreCode } from "./create-pre-code";

export const createChatItem = (
  bttv: Record<string, any>,
  message: string,
  context: ChatUserstate,
  twitchBadges: Record<string, any>
) => {
  let hasCode: RegExpMatchArray | null = message.match(`\`((.|\n)*)\``);

  const div = document.createElement("div");
  div.classList.add("chat_container");

  const span = document.createElement("span");
  span.classList.add("chat_item");

  const badgesSpan = createBadges(context, twitchBadges);
  span.appendChild(badgesSpan);

  const displayNameSpan = createDisplayName(context);
  span.appendChild(displayNameSpan);

  const messageSpan = createMessage(
    bttv,
    hasCode ? message.replace(hasCode[0], "") : message,
    context
  );

  console.log({ context });

  if (
    context["message-type"] === "chat" &&
    context["msg-id"] &&
    context["msg-id"].startsWith("highlighted")
  ) {
    messageSpan.classList.add("highlighted");
  }

  if (
    context["custom-reward-id"] &&
    context["custom-reward-id"] === "aa76b391-7267-4399-92a6-7022277e9a78"
  ) {
    messageSpan.classList.add("reward");
  }

  span.appendChild(messageSpan);
  div.appendChild(span);
  if (hasCode && hasCode[1].length > 0) {
    div.appendChild(createPreCode(message));
  }
  return div;
};
