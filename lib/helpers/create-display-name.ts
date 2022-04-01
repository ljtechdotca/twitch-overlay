import { ChatUserstate } from "tmi.js";

export const createDisplayName = (tags: ChatUserstate) => {
  if (!tags["display-name"]) throw new Error("no valid display name on tags");

  const span = document.createElement("span");
  const b = document.createElement("b");
  b.classList.add("display_name");

  b.style.color =
    tags.color ??
    ["red", "orange", "yellow", "green", "blue", "indigo", "violet"][
      Math.floor(Math.random() * 7)
    ];

  b.appendChild(document.createTextNode(tags["display-name"]));
  span.appendChild(b);

  return span;
};