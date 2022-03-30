import { Emote } from "@types";
import { ChatUserstate } from "tmi.js";

// task : refactor

export const createMessage = (
  bttv: Record<string, any>,
  message: string,
  tags: ChatUserstate
) => {
  const span = document.createElement("span");
  span.classList.add("message");

  // create an array of emotes used in the chat message
  let emotes: Emote[] = [];
  for (let id in tags.emotes) {
    for (let range of tags.emotes[id]) {
      const [start, end] = range.split("-");
      const emote: Emote = {
        id,
        start: parseInt(start),
        end: parseInt(end),
      };
      emotes.push(emote);
    }
  }
  emotes.sort((a, b) => a.start - b.end);

  // handles emote img and injection
  let emotesAndText: Array<string | HTMLImageElement> = [message];
  let lastEmoteIndex = 0;
  for (let emote of emotes) {
    emotesAndText[emotesAndText.length - 1] = message.substring(
      lastEmoteIndex,
      emote.start
    );
    const image = document.createElement("img");
    image.classList.add("emote");
    image.src = `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`;
    image.alt = emote.id;
    image.height = 28;
    emotesAndText.push(image);
    emotesAndText.push(message.substring(emote.end + 1));
    lastEmoteIndex = emote.end + 1;
  }

  // handles bttv emote injection
  for (let i = 0; i < emotesAndText.length; i++) {
    let item = emotesAndText[i];
    if (typeof item !== "string") break;
    let split = item.split(" ");
    for (let j = 0; j < split.length; j++) {
      if (split[j] in bttv) {
        const image = document.createElement("img");
        image.classList.add("emote");
        image.src = bttv[split[j]];
        image.alt = split[j];
        image.height = 28;
        emotesAndText[i] = split.slice(0, j).join(" ") + " ";
        emotesAndText.splice(i + 1, 0, ` ${split.slice(j + 1).join(" ")}`);
        emotesAndText.splice(i, 0, image);
        i--;
        break;
      }
    }
  }

  // appends emotesAndText to the message span
  for (let i = 0; i < emotesAndText.length; i++) {
    const item = emotesAndText[i];
    if (typeof item === "string") {
      span.appendChild(document.createTextNode(item));
    }
    if (item instanceof Node) {
      span.appendChild(item);
    }
  }

  return span;
};
