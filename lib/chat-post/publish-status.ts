export type PublishTarget = {
  platform?: string;
  status?: string;
  platformPostUrl?: string | null;
  error?: string | null;
  errorMessage?: string | null;
  errorCategory?: string | null;
};

export type PublishPost = {
  _id: string;
  status?: string;
  platforms?: PublishTarget[];
};

const IN_FLIGHT = new Set(["pending", "processing", "uploading", "publishing"]);
const FAILED = new Set(["failed", "cancelled"]);
const OK = new Set(["published", "scheduled"]);

export function platformEntry(post: PublishPost, platform: string) {
  return post.platforms?.find((item) => item.platform === platform) ?? post.platforms?.[0] ?? null;
}

export function platformStatus(post: PublishPost, platform: string) {
  const entry = platformEntry(post, platform);
  return (entry?.status ?? post.status ?? "").toLowerCase();
}

export function isInFlightStatus(status: string) {
  return IN_FLIGHT.has(status.toLowerCase());
}

export function platformErrorText(post: PublishPost, platform: string) {
  const entry = platformEntry(post, platform);
  return (
    entry?.errorMessage ||
    entry?.error ||
    entry?.errorCategory ||
    (post.status === "failed" ? "failed" : "") ||
    ""
  );
}

export function classifyPublishOutcome(input: {
  post: PublishPost;
  platform: string;
  mode: "publish_now" | "schedule";
}): "success" | "error" | "pending" {
  const status = platformStatus(input.post, input.platform);
  const postStatus = (input.post.status ?? "").toLowerCase();

  if (FAILED.has(status) || postStatus === "failed") return "error";
  if (postStatus === "partial" && status && !OK.has(status)) return "error";

  if (input.mode === "schedule") {
    if (FAILED.has(status)) return "error";
    return "success";
  }

  if (status === "published" || postStatus === "published") return "success";
  if (isInFlightStatus(status) || isInFlightStatus(postStatus) || !status) return "pending";
  return "error";
}
