export const PLATFORMS = [
  { id: "instagram", label: "Instagram", hint: "Feed, Reels, carousels" },
  { id: "facebook", label: "Facebook", hint: "Pages via hosted picker" },
  { id: "threads", label: "Threads", hint: "Text and media posts" },
  { id: "tiktok", label: "TikTok", hint: "Videos and photo mode" },
  { id: "youtube", label: "YouTube", hint: "Uploads and Shorts" },
  { id: "linkedin", label: "LinkedIn", hint: "Personal or company" },
  { id: "pinterest", label: "Pinterest", hint: "Pins to a board" },
  { id: "googlebusiness", label: "Google Business", hint: "Local updates" },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]["id"];

export function isPlatformId(value: string): value is PlatformId {
  return PLATFORMS.some((platform) => platform.id === value);
}

export function platformLabel(id: string) {
  return PLATFORMS.find((platform) => platform.id === id)?.label ?? id;
}
