import { createChatItem } from "@lib/helpers/create-chat-item";
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
    let twitchBadges: any = {};
    let bttv: Record<string, string> = {};
    client.on("roomstate", async (channel, state) => {
      try {
        // badges
        let response = await fetch(
          "https://badges.twitch.tv/v1/badges/global/display"
        );
        let data = await response.json();
        twitchBadges = data.badge_sets;
        // global bttv
        response = await fetch(
          "https://api.betterttv.net/3/cached/emotes/global"
        );
        data = await response.json();
        for (let item of data) {
          bttv[item.code] = `https://cdn.betterttv.net/emote/${item.id}/3x`;
        }
        // channel bttv channel and global
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
      if (self || !chatRef.current) return;
      if (chatRef.current.childNodes.length > 10) {
        chatRef.current.childNodes[0].remove();
      }

      const div = createChatItem(bttv, message, tags, twitchBadges);

      div.normalize();
      chatRef.current.appendChild(div);

      setTimeout(() => div.remove(), 1000000000);
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.root}>
      <div ref={chatRef} className={styles.container}></div>
    </div>
  );
};
