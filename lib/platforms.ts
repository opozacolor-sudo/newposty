import type { SimpleIcon } from "simple-icons";
import {
  siBluesky,
  siFacebook,
  siGooglemaps,
  siInstagram,
  siPinterest,
  siReddit,
  siThreads,
  siTiktok,
  siX,
  siYoutube,
} from "simple-icons";

const siLinkedinFallback: Pick<SimpleIcon, "path" | "hex" | "title"> = {
  title: "LinkedIn",
  hex: "0A66C2",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

export const PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    brand: "#E1306C",
    iconBg:
      "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    icon: siInstagram,
  },
  {
    id: "facebook",
    label: "Facebook",
    brand: "#1877F2",
    iconBg: "#1877F2",
    icon: siFacebook,
  },
  {
    id: "threads",
    label: "Threads",
    brand: "#000000",
    iconBg: "#000000",
    icon: siThreads,
  },
  {
    id: "tiktok",
    label: "TikTok",
    brand: "#010101",
    iconBg: "#010101",
    icon: siTiktok,
  },
  {
    id: "youtube",
    label: "YouTube",
    brand: "#FF0000",
    iconBg: "#FF0000",
    icon: siYoutube,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    brand: "#0A66C2",
    iconBg: "#0A66C2",
    icon: siLinkedinFallback,
  },
  {
    id: "pinterest",
    label: "Pinterest",
    brand: "#E60023",
    iconBg: "#E60023",
    icon: siPinterest,
  },
  {
    id: "googlebusiness",
    label: "Google Business",
    brand: "#4285F4",
    iconBg: "#4285F4",
    icon: siGooglemaps,
  },
  {
    id: "twitter",
    label: "Twitter/X",
    brand: "#000000",
    iconBg: "#000000",
    icon: siX,
  },
  {
    id: "bluesky",
    label: "Bluesky",
    brand: "#1185FE",
    iconBg: "#1185FE",
    icon: siBluesky,
  },
  {
    id: "reddit",
    label: "Reddit",
    brand: "#FF4500",
    iconBg: "#FF4500",
    icon: siReddit,
  },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]["id"];
export type Platform = (typeof PLATFORMS)[number];

export function isPlatformId(value: string): value is PlatformId {
  return PLATFORMS.some((platform) => platform.id === value);
}

export function platformLabel(id: string) {
  return PLATFORMS.find((platform) => platform.id === id)?.label ?? id;
}

export function getPlatform(id: string) {
  return PLATFORMS.find((platform) => platform.id === id);
}
