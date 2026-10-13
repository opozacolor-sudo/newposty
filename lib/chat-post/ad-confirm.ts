export function foldChatText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLowerCase();
}

function compactNetwork(network: string) {
  return foldChatText(network).replace(/[^a-z0-9]/g, "");
}

export function isMetaAdNetwork(network: string) {
  const n = compactNetwork(network);
  return (
    n === "ig" ||
    n === "fb" ||
    n.includes("instagram") ||
    n.includes("facebook") ||
    n.includes("metaads") ||
    n === "meta"
  );
}

export function isTikTokAdNetwork(network: string) {
  const n = compactNetwork(network);
  return n.includes("tiktok") || n === "spark";
}

export function pickLatestInstagramInboxPost<
  T extends { id?: string; platform?: string; createdTime?: string },
>(posts: T[]) {
  const ranked = posts
    .filter((post) => post.id && (post.platform ?? "instagram") === "instagram")
    .slice()
    .sort((a, b) => Date.parse(b.createdTime ?? "") - Date.parse(a.createdTime ?? ""));
  return ranked[0] ?? null;
}

export function isAdConfirmReply(text: string) {
  return /^(confirm|confirma|ok|da|yes|oui|si|ja|porneste|porneste reclama|start( the ad)?|lancer( la pub)?|lanzar( el anuncio)?|avvia( l.ads)?|anzeige starten)$/i.test(
    foldChatText(text),
  );
}

export function geoKey(hit: { id: string; name: string }) {
  return { key: hit.id, name: hit.name };
}

export function numericTikTokItemId(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const text = String(value);
  const fromUrl = text.match(/\/video\/(\d{10,})/i);
  if (fromUrl) return fromUrl[1];
  const fromIdentity = text.match(/(?:v_pub_url~v2\.|item[_-]?id[=:]?)(\d{10,})/i);
  if (fromIdentity) return fromIdentity[1];
  const digits = text.match(/(\d{15,})/);
  if (digits) return digits[1];
  if (/^\d{10,}$/.test(text.trim())) return text.trim();
  return null;
}

export function tiktokItemIdFromPost(post: {
  platforms?: Array<Record<string, unknown> | undefined> | null;
}): string | null {
  const entry =
    post.platforms?.find((item) => item && item.platform === "tiktok") ?? post.platforms?.[0] ?? null;
  if (!entry) return null;
  const candidates = [
    entry.platformPostId,
    entry.tiktokItemId,
    entry.platformId,
    entry.publishedUrl,
    entry.platformPostUrl,
    entry.url,
    entry.permalink,
    entry.shareUrl,
    entry.postUrl,
    entry.identity,
    entry.publishId,
  ];
  for (const value of candidates) {
    const id = numericTikTokItemId(value);
    if (id) return id;
  }
  return null;
}
