import { RoomState } from "tmi.js";

export const fetchBttvEmotes = async (state: RoomState) => {
  let bttv: Record<string, string> = {};
  // fetch global emotes
  let response = await fetch(
    "https://api.betterttv.net/3/cached/emotes/global"
  );
  let data = await response.json();
  for (let item of data) {
    bttv[item.code] = `https://cdn.betterttv.net/emote/${item.id}/3x`;
  }

  // fetch user emotes
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

  return bttv;
};
