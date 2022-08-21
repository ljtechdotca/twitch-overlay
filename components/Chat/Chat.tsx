import {
  createChatItem,
  fetchBttvEmotes,
  fetchTwitchBadges,
} from "@lib/helpers";
import { useEffect, useRef } from "react";
import tmi from "tmi.js";
import styles from "./Chat.module.scss";

export const Chat = ({}) => {
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

    // initialize stream overlay with emotes from bttv and badges from twitch api
    let bttv: Record<string, string> = {};
    let twitchBadges: any = {};
    client.on("roomstate", async (channel, state) => {
      try {
        bttv = await fetchBttvEmotes(state);
        twitchBadges = await fetchTwitchBadges();
      } catch (error) {
        console.error(error);
      }
    });

    client.on("message", (channel, context, message, self) => {
      if (self || !chatRef.current) return;
      const div = createChatItem(bttv, message, context, twitchBadges);
      div.normalize();
      chatRef.current.appendChild(div);
      if (chatRef.current.childNodes.length > 10) {
        chatRef.current.childNodes[0].remove();
      }
      setTimeout(() => div.remove(), 60000);
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    return () => {
      client.disconnect();
    };
  }, []);

  return (
    <div className={styles.root}>
      <div ref={chatRef} className={styles.container}></div>
    </div>
  );
};
