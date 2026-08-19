import type { SimpleIcon } from "simple-icons";
import {
  siBluesky,
  siFacebook,
  siGoogleads,
  siGooglemaps,
  siInstagram,
  siMeta,
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
    stats: "complete",
  },
  {
    id: "facebook",
    label: "Facebook",
    brand: "#1877F2",
    iconBg: "#1877F2",
    icon: siFacebook,
    stats: "complete",
  },
  {
    id: "threads",
    label: "Threads",
    brand: "#000000",
    iconBg: "#000000",
    icon: siThreads,
    stats: "complete",
  },
  {
    id: "tiktok",
    label: "TikTok",
    brand: "#010101",
    iconBg: "#010101",
    icon: siTiktok,
    stats: "complete",
  },
  {
    id: "youtube",
    label: "YouTube",
    brand: "#FF0000",
    iconBg: "#FF0000",
    icon: siYoutube,
    stats: "complete",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    brand: "#0A66C2",
    iconBg: "#0A66C2",
    icon: siLinkedinFallback,
    stats: "complete",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    brand: "#E60023",
    iconBg: "#E60023",
    icon: siPinterest,
    stats: "complete",
  },
  {
    id: "googlebusiness",
    label: "Google Business",
    brand: "#4285F4",
    iconBg: "#4285F4",
    icon: siGooglemaps,
    stats: "complete",
  },
  {
    id: "twitter",
    label: "Twitter/X",
    brand: "#000000",
    iconBg: "#000000",
    icon: siX,
    stats: "complete",
  },
  {
    id: "bluesky",
    label: "Bluesky",
    brand: "#1185FE",
    iconBg: "#1185FE",
    icon: siBluesky,
    stats: "limited",
  },
  {
    id: "reddit",
    label: "Reddit",
    brand: "#FF4500",
    iconBg: "#FF4500",
    icon: siReddit,
    stats: "limited",
  },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]["id"];
export type Platform = (typeof PLATFORMS)[number];

export function isPlatformId(value: string): value is PlatformId {
  return PLATFORMS.some((platform) => platform.id === value);
}

export function platformLabel(id: string) {
  return (
    PLATFORMS.find((platform) => platform.id === id)?.label ??
    ADS_PLATFORMS.find((platform) => platform.id === id)?.label ??
    id
  );
}

export function getPlatform(id: string) {
  return PLATFORMS.find((platform) => platform.id === id) ?? ADS_PLATFORMS.find((platform) => platform.id === id);
}

const siOpenaiFallback: Pick<SimpleIcon, "path" | "hex" | "title"> = {
  title: "OpenAI",
  hex: "412991",
  path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.2782a4.485 4.485 0 0 1 2.3313-1.9723V11.431a.7953.7953 0 0 0 .3927.6813l5.8468 3.3686-2.02 1.1685a.073.073 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.272zm16.5963 3.7905-5.8448-3.3686 2.02-1.1637a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6568 8.1042v-5.6772a.79.79 0 0 0-.407-.6813zm2.0107-3.0231-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7953.7953 0 0 0-.393.6813zm1.0976-2.3654 2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
};

export const ADS_PLATFORMS = [
  {
    id: "metaads",
    label: "Meta Ads",
    brand: "#0668E1",
    iconBg: "#0668E1",
    icon: siMeta,
    audienceBadge: null,
    isNew: false,
    connectPath: "facebook/ads",
  },
  {
    id: "googleads",
    label: "Google Ads",
    brand: "#4285F4",
    iconBg: "#4285F4",
    icon: siGoogleads,
    audienceBadge: "unavailable" as const,
    isNew: false,
    connectPath: "googleads/ads",
  },
  {
    id: "linkedinads",
    label: "LinkedIn Ads",
    brand: "#0A66C2",
    iconBg: "#0A66C2",
    icon: siLinkedinFallback,
    audienceBadge: "readonly" as const,
    isNew: false,
    connectPath: "linkedin/ads",
  },
  {
    id: "tiktokads",
    label: "TikTok Ads",
    brand: "#010101",
    iconBg: "#010101",
    icon: siTiktok,
    audienceBadge: null,
    isNew: false,
    connectPath: "tiktok/ads",
    parentPlatform: "tiktok",
  },
  {
    id: "pinterestads",
    label: "Pinterest Ads",
    brand: "#E60023",
    iconBg: "#E60023",
    icon: siPinterest,
    audienceBadge: null,
    isNew: false,
    connectPath: "pinterest/ads",
  },
  {
    id: "xads",
    label: "X Ads",
    brand: "#000000",
    iconBg: "#000000",
    icon: siX,
    audienceBadge: "unavailable" as const,
    isNew: false,
    connectPath: "twitter/ads",
    parentPlatform: "twitter",
    parentRequired: true,
  },
  {
    id: "openaiads",
    label: "OpenAI Ads",
    brand: "#000000",
    iconBg: "#000000",
    icon: siOpenaiFallback,
    audienceBadge: null,
    isNew: true,
    connectPath: "openai-ads/credentials",
    credentials: true,
  },
] as const;

export type AdsPlatformId = (typeof ADS_PLATFORMS)[number]["id"];
export type AdsPlatform = (typeof ADS_PLATFORMS)[number];
export type ConnectPlatformId = PlatformId | AdsPlatformId;

export function isAdsPlatformId(value: string): value is AdsPlatformId {
  return ADS_PLATFORMS.some((platform) => platform.id === value);
}

export function isConnectPlatformId(value: string): value is ConnectPlatformId {
  return isPlatformId(value) || isAdsPlatformId(value);
}

export function getAdsPlatform(id: string) {
  return ADS_PLATFORMS.find((platform) => platform.id === id);
}

export function platformHasLimitedStats(id: string) {
  return PLATFORMS.find((platform) => platform.id === id)?.stats === "limited";
}

export const COMMENT_INBOX_PLATFORMS = new Set([
  "facebook",
  "instagram",
  "twitter",
  "bluesky",
  "threads",
  "youtube",
  "linkedin",
  "reddit",
]);
