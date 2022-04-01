import { ChatUserstate } from "tmi.js";

export const createBadges = (
  tags: ChatUserstate,
  twitchBadges: Record<string, any>
) => {
  const span = document.createElement("span");
  span.classList.add("badges");
  if (tags.badges) {
    Object.entries(tags.badges).forEach(([key, value]) => {
      const image = document.createElement("img");
      image.height = 18;
      image.src = twitchBadges[key].versions["1"]
        ? twitchBadges[key].versions["1"].image_url_1x
        : twitchBadges[key].versions["0"].image_url_1x;
      image.classList.add("badge");
      span.appendChild(image);
    });
  }

  return span;
};
