import { getAdsPlatform, type AdsPlatformId } from "@/lib/platforms";

/** Campaign goals we can actually brief on connected ads accounts. */
export const AD_OBJECTIVES = [
  {
    id: "views",
    platforms: ["metaads", "tiktokads", "linkedinads", "pinterestads"],
  },
  {
    id: "traffic",
    platforms: ["googleads", "metaads", "linkedinads", "pinterestads", "openaiads"],
  },
  {
    id: "leads",
    platforms: ["metaads", "linkedinads", "googleads"],
  },
] as const;

export type AdObjectiveId = (typeof AD_OBJECTIVES)[number]["id"];

export function adObjectivePlatforms(id: AdObjectiveId) {
  const row = AD_OBJECTIVES.find((item) => item.id === id);
  if (!row) return [];
  return row.platforms
    .map((platformId) => getAdsPlatform(platformId as AdsPlatformId))
    .filter((platform): platform is NonNullable<typeof platform> => Boolean(platform));
}
