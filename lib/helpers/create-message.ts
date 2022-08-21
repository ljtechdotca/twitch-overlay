import { Emote } from "@types";
import { ChatUserstate } from "tmi.js";

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
  let twitchMessages: Array<string> = [message];
  let twitchEmotes: Array<HTMLImageElement> = [];
  let lastEmoteIndex = 0;
  for (let emote of emotes) {
    twitchMessages[twitchMessages.length - 1] = message.substring(
      lastEmoteIndex,
      emote.start
    );
    const image = document.createElement("img");
    image.classList.add("emote");
    image.src = `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`;
    image.alt = emote.id;
    image.height = 28;

    twitchEmotes.push(image);
    twitchMessages.push(message.substring(emote.end + 1));
    lastEmoteIndex = emote.end + 1;
  }

  // handles bttv emote injection
  for (let i = 0; i < twitchMessages.length; i++) {
    let item = twitchMessages[i];
    let split = item.split(" ");
    for (let j = 0; j < split.length; j++) {
      if (bttv.hasOwnProperty(split[j])) {
        const image = document.createElement("img");
        image.classList.add("emote");
        image.src = bttv[split[j]];
        image.alt = split[j];
        image.height = 28;
        twitchMessages[i] = split.slice(0, j).join(" ") + " ";
        twitchMessages.splice(i + 1, 0, ` ${split.slice(j + 1).join(" ")}`);
        twitchEmotes.splice(i, 0, image);
        i--;
        break;
      }
    }
  }

  // combine messages and emotes together
  let resultArray: Array<Text | HTMLImageElement> = [];

  for (let i = 0; i < twitchMessages.length; i++) {
    resultArray.push(document.createTextNode(twitchMessages[i]));
    if (twitchEmotes[i]) {
      resultArray.push(twitchEmotes[i]);
    }
  }

  // append the items to the message span
  for (let result of resultArray) {
    span.appendChild(result);
  }

  return span;
};
