export const fetchTwitchBadges = async () => {
  const response = await fetch(
    "https://badges.twitch.tv/v1/badges/global/display"
  );
  const { badge_sets } = await response.json();
  return badge_sets;
};
