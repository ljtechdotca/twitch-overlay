import { ChatUserstate } from "tmi.js";

export const createDisplayName = (tags: ChatUserstate) => {
  if (!tags["display-name"]) throw new Error("no valid display name on tags");

  const span = document.createElement("span");
  const b = document.createElement("b");
  b.classList.add("display_name");

  b.style.color = tags.color ?? "dodgerblue";

  b.appendChild(document.createTextNode(tags["display-name"]));
  span.appendChild(b);
  span.appendChild(document.createTextNode(": "));

  return span;
};
