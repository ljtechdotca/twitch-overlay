import { ChatUserstate } from "tmi.js";
import { createBadges } from "./create-badges";
import { createDisplayName } from "./create-display-name";
import { createMessage } from "./create-message";
import { createPreCode } from "./create-pre-code";

export const createChatItem = (
  bttv: Record<string, any>,
  message: string,
  tags: ChatUserstate,
  twitchBadges: Record<string, any>
) => {
  let hasCode: RegExpMatchArray | null = message.match(`\`((.|\n)*)\``);

  const div = document.createElement("div");
  div.classList.add("chat_container");

  const span = document.createElement("span");
  span.classList.add("chat_item");

  console.log({ tags });
  const badgesSpan = createBadges(tags, twitchBadges);
  span.appendChild(badgesSpan);

  const displayNameSpan = createDisplayName(tags);
  span.appendChild(displayNameSpan);

  const messageSpan = createMessage(
    bttv,
    hasCode ? message.replace(hasCode[0], "") : message,
    tags
  );

  span.appendChild(messageSpan);
  div.appendChild(span);
  if (hasCode && hasCode[1].length > 0) {
    div.appendChild(createPreCode(message));
  }
  return div;
};
