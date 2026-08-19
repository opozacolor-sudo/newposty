import { getZernioApiKey } from "@/lib/env";

const ZERNIO_BASE = "https://zernio.com/api/v1";

export class ZernioError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ZernioError";
    this.status = status;
    this.body = body;
  }
}

async function zernioFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${getZernioApiKey()}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${ZERNIO_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  const body = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const message =
      typeof body === "object" && body && "error" in body
        ? String((body as { error: unknown }).error)
        : `Zernio request failed (${response.status})`;
    throw new ZernioError(message, response.status, body);
  }

  return body as T;
}

export type ZernioProfile = { _id: string; name?: string };
export type ZernioAccount = {
  _id: string;
  platform: string;
  username?: string;
  displayName?: string;
  profilePicture?: string;
  isActive?: boolean;
  profileId?: string;
};
export type ZernioMediaItem = { url: string; type: "image" | "video"; title?: string };
export type ZernioPlatformTarget = { platform: string; accountId: string };
export type ZernioPost = {
  _id: string;
  status?: string;
  content?: string;
  scheduledFor?: string;
  platforms?: Array<{
    platform: string;
    status?: string;
    platformPostUrl?: string;
    accountId?: string | { _id: string };
  }>;
};

export async function createZernioProfile(name: string, description: string) {
  const data = await zernioFetch<{ profile: ZernioProfile }>("/profiles", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
  return data.profile;
}

export async function getConnectUrl(input: {
  platform: string;
  profileId: string;
  redirectUrl: string;
}) {
  const params = new URLSearchParams({
    profileId: input.profileId,
    redirect_url: input.redirectUrl,
  });
  const data = await zernioFetch<{ authUrl: string }>(
    `/connect/${encodeURIComponent(input.platform)}?${params.toString()}`,
  );
  return data.authUrl;
}

export type AdsConnectResult =
  | { alreadyConnected: true; accountId?: string; platform?: string }
  | { authUrl: string };

function readConnectAuthUrl(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (typeof record.authUrl === "string") return record.authUrl;
  if (typeof record.url === "string") return record.url;
  const nested = record.data;
  if (nested && typeof nested === "object" && "authUrl" in nested) {
    const authUrl = (nested as { authUrl?: unknown }).authUrl;
    if (typeof authUrl === "string") return authUrl;
  }
  return null;
}

export async function connectAdsAccount(input: {
  connectPath: string;
  profileId: string;
  redirectUrl: string;
  accountId?: string;
  force?: boolean;
}): Promise<AdsConnectResult> {
  const params = new URLSearchParams({
    profileId: input.profileId,
    redirect_url: input.redirectUrl,
  });
  if (input.accountId) params.set("accountId", input.accountId);
  if (input.force) params.set("force", "true");

  const data = await zernioFetch<Record<string, unknown>>(
    `/connect/${input.connectPath}?${params.toString()}`,
  );

  if (data.alreadyConnected === true) {
    return {
      alreadyConnected: true,
      accountId: typeof data.accountId === "string" ? data.accountId : undefined,
      platform: typeof data.platform === "string" ? data.platform : undefined,
    };
  }

  const authUrl = readConnectAuthUrl(data);
  if (authUrl) return { authUrl };

  throw new Error("Connect did not return an authorization URL.");
}

export async function connectOpenAIAdsCredentials(input: {
  apiKey: string;
  profileId: string;
}) {
  return zernioFetch<{ accountId?: string; adAccountName?: string }>(
    "/connect/openai-ads/credentials",
    {
      method: "POST",
      body: JSON.stringify({
        apiKey: input.apiKey,
        profileId: input.profileId,
      }),
    },
  );
}

export async function getZernioCurrentUserId() {
  const data = await zernioFetch<unknown>("/users");
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (typeof record.currentUserId === "string") return record.currentUserId;
  const user = record.user;
  if (user && typeof user === "object" && "_id" in user && typeof user._id === "string") {
    return user._id;
  }
  const users = record.users;
  if (Array.isArray(users) && users[0] && typeof users[0] === "object" && "_id" in users[0]) {
    const first = users[0] as { _id?: string };
    if (typeof first._id === "string") return first._id;
  }
  return null;
}

export async function connectBlueskyCredentials(input: {
  identifier: string;
  appPassword: string;
  profileId: string;
}) {
  const userId = await getZernioCurrentUserId();
  const state = userId ? `${userId}-${input.profileId}` : `profile_id=${input.profileId}`;
  return zernioFetch<{
    message?: string;
    account?: ZernioAccount;
  }>("/connect/bluesky/credentials", {
    method: "POST",
    body: JSON.stringify({
      identifier: input.identifier,
      appPassword: input.appPassword,
      state,
    }),
  });
}

export async function listAccounts(profileId: string) {
  const params = new URLSearchParams({ profileId });
  const data = await zernioFetch<{ accounts: ZernioAccount[] }>(
    `/accounts?${params.toString()}`,
  );
  return data.accounts ?? [];
}

export async function presignMedia(filename: string, contentType: string) {
  return zernioFetch<{ uploadUrl: string; publicUrl: string }>(
    "/media/presign",
    {
      method: "POST",
      body: JSON.stringify({ filename, contentType }),
    },
  );
}

export async function createPost(input: {
  content: string;
  platforms: ZernioPlatformTarget[];
  mediaItems?: ZernioMediaItem[];
  publishNow?: boolean;
  scheduledFor?: string;
  timezone?: string;
}) {
  const data = await zernioFetch<{ post: ZernioPost }>("/posts", {
    method: "POST",
    body: JSON.stringify({
      content: input.content,
      platforms: input.platforms,
      mediaItems: input.mediaItems,
      publishNow: input.publishNow ?? false,
      scheduledFor: input.scheduledFor,
      timezone: input.timezone ?? "UTC",
    }),
  });
  return data.post;
}

export async function getPost(postId: string) {
  const data = await zernioFetch<{ post: ZernioPost }>(
    `/posts/${encodeURIComponent(postId)}`,
  );
  return data.post;
}
