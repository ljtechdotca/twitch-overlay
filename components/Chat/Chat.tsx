import { useEffect, useRef } from "react";
import tmi from "tmi.js";
import styles from "./Chat.module.scss";

interface Emote {
  id: string;
  start: number;
  end: number;
}

export interface ChatProps {
  badges: any;
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

    client.on("message", (channel, tags, message, self) => {
      if (self) return;

      if (chatRef.current && tags["display-name"]) {
        const itemDiv = document.createElement("div");

        itemDiv.style.display = "flex";
        itemDiv.style.flexWrap = "wrap";
        itemDiv.style.columnGap = "0.25rem";
        itemDiv.style.alignItems = "center";
        itemDiv.style.paddingBottom = "1rem";
        itemDiv.style.fontSize = "1.25rem";

        // handle badges
        if (tags.badges) {
          const badgesSpan = document.createElement("span");

          Object.entries(tags.badges).forEach(([key, value]) => {
            const image = document.createElement("img");

            image.height = 18;
            image.width = 18;
            image.src = badges[key].versions["1"].image_url_1x;
            image.style.marginRight = "0.25rem";

            badgesSpan.appendChild(image);
          });
          itemDiv.appendChild(badgesSpan);
        }

        // handle name
        const nameSpan = document.createElement("span");
        const colorSpan = document.createElement("span");
        colorSpan.style.color = tags.color ?? "#000000";
        colorSpan.style.fontWeight = "700";
        colorSpan.appendChild(document.createTextNode(tags["display-name"]));
        nameSpan.style.fontWeight = "700";
        nameSpan.style.display = "flex";
        nameSpan.style.columnGap = "0.25rem";
        nameSpan.style.alignItems = "center";
        nameSpan.appendChild(colorSpan);
        nameSpan.appendChild(document.createTextNode(":  "));
        itemDiv.appendChild(nameSpan);

        // handle message
        const messageSpan = document.createElement("span");
        messageSpan.style.display = "flex";
        messageSpan.style.flexWrap = "wrap";
        messageSpan.style.columnGap = "0.25rem";
        messageSpan.style.alignItems = "center";
        messageSpan.style.wordBreak = "break-word";
        let newMessage = "";
        if (tags.emotes) {
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
              `<img src='https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0' width='28' height='28' />`
            );
            parts.push(message.substring(emote.end + 1));
            lastEmoteIndex = emote.end + 1;
          }
          console.log(parts, images, emotes);
          // todo : bttv
          // for (let i = 0; i < parts.length; i++) {
          //   let split = parts[i].split(" ");
          //   for (let j = 0; j < split.length; j++) {}
          // }
          for (let i = 0; i < parts.length; i++) {
            newMessage += parts[i]
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
            if (images[i]) newMessage += images[i];
          }
          messageSpan.innerHTML = newMessage;
        } else {
          messageSpan.appendChild(document.createTextNode(message));
        }
        itemDiv.appendChild(messageSpan);
        chatRef.current.appendChild(itemDiv);
        if (chatRef.current.childNodes.length > 10) {
          chatRef.current.childNodes[0].remove();
        }
        itemDiv.scrollIntoView({ behavior: "smooth", block: "end" });
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
