import { Emote } from "@types";
import { useEffect, useRef } from "react";
import tmi from "tmi.js";
import styles from "./Chat.module.scss";

export interface ChatProps {}

export const Chat = ({}: ChatProps) => {
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

    // api call for images
    let badges: any = {};
    let bttv: Record<string, string> = {};
    client.on("roomstate", async (channel, state) => {
      try {
        // badges
        let response = await fetch(
          "https://badges.twitch.tv/v1/badges/global/display"
        );
        let data = await response.json();
        badges = data.badge_sets;
        // global bttv
        response = await fetch(
          "https://api.betterttv.net/3/cached/emotes/global"
        );
        data = await response.json();
        for (let item of data) {
          bttv[item.code] = `https://cdn.betterttv.net/emote/${item.id}/3x`;
        }
        // channel bttv
        response = await fetch(
          `https://api.betterttv.net/3/cached/users/twitch/${state["room-id"]}`
        );
        data = await response.json();
        for (let item of data.channelEmotes) {
          bttv[item.code] = `https://cdn.betterttv.net/emote/${item.id}/3x`;
        }
        for (let item of data.sharedEmotes) {
          bttv[item.code] = `https://cdn.betterttv.net/emote/${item.id}/3x`;
        }
      } catch (error) {
        console.error(error);
      }
    });

    client.on("message", (channel, tags, message, self) => {
      if (self) return;
      if (chatRef.current && tags["display-name"]) {
        // create div item
        const div = document.createElement("div");
        div.classList.add("item");

        // create span badges
        if (tags.badges) {
          const span = document.createElement("span");
          span.classList.add("badges");
          Object.entries(tags.badges).forEach(([key, value]) => {
            const image = document.createElement("img");
            console.log(badges[key]);
            image.height = 18;
            image.src = badges[key].versions["1"]
              ? badges[key].versions["1"].image_url_1x
              : badges[key].versions["0"].image_url_1x;
            image.classList.add("badge");
            span.appendChild(image);
          });
          div.appendChild(span);
        }

        // create span name
        const span = document.createElement("span");
        const b = document.createElement("b");
        span.classList.add("name");
        b.style.color =
          tags.color ??
          ["red", "orange", "yellow", "green", "blue", "indigo", "violet"][
            Math.floor(Math.random() * 7)
          ];
        b.appendChild(document.createTextNode(tags["display-name"]));
        span.appendChild(b);
        span.appendChild(document.createTextNode(": "));
        div.appendChild(span);

        // create p message
        const p = document.createElement("p");
        p.classList.add("message");
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
          const image = document.createElement("img");
          image.classList.add("emote");
          image.src = `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`;
          image.alt = emote.id;
          image.height = 28;
          images.push(image);
          parts.push(message.substring(emote.end + 1));
          lastEmoteIndex = emote.end + 1;
        }
        for (let i = 0; i < parts.length; i++) {
          let split = parts[i].split(" ");
          for (let j = 0; j < split.length; j++) {
            if (split[j] in bttv) {
              const image = document.createElement("img");
              image.classList.add("emote");
              image.src = bttv[split[j]];
              image.alt = split[j];
              image.height = 28;
              parts[i] = split.slice(0, j).join(" ") + " ";
              parts.splice(i + 1, 0, ` ${split.slice(j + 1).join(" ")}`);
              images.splice(i, 0, image);
              i--;
              break;
            }
          }
        }
        for (let i = 0; i < parts.length; i++) {
          p.appendChild(document.createTextNode(parts[i]));
          if (images[i]) p.appendChild(images[i]);
        }
        div.appendChild(p);
        div.normalize();
        chatRef.current.appendChild(div);
        if (chatRef.current.childNodes.length > 10) {
          chatRef.current.childNodes[0].remove();
        }
        setTimeout(() => div.remove(), 60000);
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
