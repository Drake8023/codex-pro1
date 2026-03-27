export const avatarPresetIds = ["aurora", "pebble", "sunset", "iris", "mint", "ember"] as const;

export function getAvatarPresetUrl(presetId: (typeof avatarPresetIds)[number]) {
  return `/api/avatar-presets/${presetId}.svg`;
}
