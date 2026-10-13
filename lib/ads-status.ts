export const CAMPAIGN_STATUS_KEYS = [
  "campaignStatusActive",
  "campaignStatusPaused",
  "campaignStatusInReview",
  "campaignStatusCompleted",
  "campaignStatusDeleted",
  "campaignStatusArchived",
] as const;

export type CampaignStatusKey = (typeof CAMPAIGN_STATUS_KEYS)[number];

export function campaignStatusKey(status: string | null | undefined): CampaignStatusKey | null {
  const value = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
  if (!value) return null;
  if (/\b(paused|pause|disabled|stopped)\b/.test(value)) return "campaignStatusPaused";
  if (/\b(review|pending|processing|in process)\b/.test(value)) return "campaignStatusInReview";
  if (/\b(completed|finished|ended|done)\b/.test(value)) return "campaignStatusCompleted";
  if (/\bdeleted\b/.test(value)) return "campaignStatusDeleted";
  if (/\barchived\b/.test(value)) return "campaignStatusArchived";
  if (/\b(active|enabled|running|live)\b/.test(value)) return "campaignStatusActive";
  return null;
}

export function campaignStatusLabel(
  status: string | null | undefined,
  t: (key: CampaignStatusKey) => string,
) {
  const key = campaignStatusKey(status);
  return key ? t(key) : status?.trim() || "—";
}
