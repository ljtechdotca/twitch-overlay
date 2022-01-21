import { ChatUserstate } from "tmi.js";

export interface Message {
  channel: string;
  tags: ChatUserstate;
  message: string;
  self: boolean;
}
