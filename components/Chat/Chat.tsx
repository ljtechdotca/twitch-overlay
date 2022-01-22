import { useEffect, useRef } from "react";
import tmi from "tmi.js";
import styles from "./Chat.module.scss";

interface Emote {
  id: string;
  start: number;
  end: number;
}

export interface ChatProps {
  badges: Record<string, any>;
}

export const Chat = ({ badges }: ChatProps) => {
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const client = new tmi.Client({
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: ["ljtechdotca"],
    });

    client.connect().catch(console.error);

    client.on("connected", (address, port) => {
      console.log(`Connected to ${address}:${port}`);
    });

    let bttvEmotes: Record<string, string> = {};

    client.on("roomstate", async (channel, state) => {
      try {
        let response = await fetch(
          "https://api.betterttv.net/3/cached/emotes/global"
        );
        let data = await response.json();
        for (let item of data) {
          bttvEmotes[
            item.code
          ] = `https://cdn.betterttv.net/emote/${item.id}/3x`;
        }
        response = await fetch(
          `https://api.betterttv.net/3/cached/users/twitch/${state["room-id"]}`
        );
        data = await response.json();
        for (let item of data.channelEmotes) {
          bttvEmotes[
            item.code
          ] = `https://cdn.betterttv.net/emote/${item.id}/3x`;
        }
        for (let item of data.sharedEmotes) {
          bttvEmotes[
            item.code
          ] = `https://cdn.betterttv.net/emote/${item.id}/3x`;
        }
      } catch (error) {
        console.error(error);
      }
    });

    client.on("message", (channel, tags, message, self) => {
      if (self) return;

      if (chatRef.current && tags["display-name"]) {
        const div = document.createElement("div");
        div.classList.add("item");

        // handle badges
        if (tags.badges) {
          const span = document.createElement("span");
          span.classList.add("badges");

          Object.entries(tags.badges).forEach(([key, value]) => {
            const image = document.createElement("img");

            image.height = 18;
            image.width = 18;
            image.src = badges[key].versions["1"].image_url_1x;
            image.classList.add("badge");

            span.appendChild(image);
          });
          div.appendChild(span);
        }

        // handle name
        const span = document.createElement("span");
        const b = document.createElement("b");
        span.classList.add("name");
        b.style.color = tags.color ?? "#000000";
        b.appendChild(document.createTextNode(tags["display-name"]));
        span.appendChild(b);
        span.appendChild(document.createTextNode(":"));
        div.appendChild(span);

        // handle message
        const p = document.createElement("p");
        // todo - add class name
        p.classList.add("message");

        let newMessage = "";

        let emotes: Emote[] = [];
        let parts = [message];
        let images = [];
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
        let lastEmoteIndex = 0;
        for (let emote of emotes) {
          parts[parts.length - 1] = message.substring(
            lastEmoteIndex,
            emote.start
          );
          images.push(
            `<img alt=${emote.id} src='https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0' width='28' height='28' />`
          );
          parts.push(message.substring(emote.end + 1));
          lastEmoteIndex = emote.end + 1;
        }
        console.log(parts, images, emotes);

        // handle bttv
        for (let i = 0; i < parts.length; i++) {
          let split = parts[i].split(" ");
          console.log({ split });
          for (let j = 0; j < split.length; j++) {
            if (split[j] in bttvEmotes) {
              parts[i] = split.slice(0, j).join(" ") + " ";
              parts.splice(i + 1, 0, ` ${split.slice(j + 1).join(" ")}`);
              images.splice(
                i,
                0,
                `<img alt=${split[j]} src=${
                  bttvEmotes[split[j]]
                } height='28' width='28' />`
              );
              i--;
            }
          }
        }

        // todo - no need to .replace if using textNode
        for (let i = 0; i < parts.length; i++) {
          newMessage += parts[i]
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
          if (images[i]) newMessage += images[i];
        }
        // todo - use create text node instead of innerHTML
        p.innerHTML = newMessage;

        div.appendChild(p);
        chatRef.current.appendChild(div);
        if (chatRef.current.childNodes.length > 10) {
          chatRef.current.childNodes[0].remove();
        }
        div.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.root}>
      <div ref={chatRef} className={styles.container}></div>
    </div>
  );
};
