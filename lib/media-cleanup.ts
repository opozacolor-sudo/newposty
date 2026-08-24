import type { SupabaseClient } from "@supabase/supabase-js";

const PUBLIC_MARKER = "/storage/v1/object/public/media/";

export function mediaPathFromUrl(url: string) {
  const index = url.indexOf(PUBLIC_MARKER);
  if (index < 0) return null;
  return decodeURIComponent(url.slice(index + PUBLIC_MARKER.length));
}

export async function keepMediaPaths(supabase: SupabaseClient, userId?: string) {
  let query = supabase.from("posts").select("status, scheduled_for, created_at, media");
  if (userId) query = query.eq("user_id", userId);
  const { data: posts } = await query;
  const keep = new Set<string>();
  const now = Date.now();
  for (const post of posts ?? []) {
    const scheduled =
      post.status === "scheduled" &&
      Boolean(post.scheduled_for) &&
      new Date(post.scheduled_for as string).getTime() > now - 6 * 60 * 60 * 1000;
    const inFlight =
      ["publishing", "pending", "processing"].includes(String(post.status)) &&
      now - new Date(post.created_at as string).getTime() < 2 * 60 * 60 * 1000;
    if (!scheduled && !inFlight) continue;
    const media = Array.isArray(post.media) ? post.media : [];
    for (const item of media) {
      const url = item && typeof item === "object" ? String((item as { url?: string }).url ?? "") : "";
      const path = mediaPathFromUrl(url);
      if (path) keep.add(path);
    }
  }
  return keep;
}

export async function removeMediaPaths(supabase: SupabaseClient, paths: string[]) {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return { removed: 0 };
  const { error } = await supabase.storage.from("media").remove(unique);
  if (error) throw error;
  return { removed: unique.length };
}

export async function purgeUnusedMediaForUser(supabase: SupabaseClient, userId: string) {
  const keep = await keepMediaPaths(supabase, userId);
  const { data: objects, error } = await supabase.storage.from("media").list(userId, {
    limit: 1000,
  });
  if (error) throw error;
  const staleMs = 2 * 60 * 60 * 1000;
  const now = Date.now();
  const paths: string[] = [];
  for (const object of objects ?? []) {
    const path = `${userId}/${object.name}`;
    if (keep.has(path)) continue;
    const created = object.created_at ? new Date(object.created_at).getTime() : 0;
    if (now - created < staleMs) continue;
    paths.push(path);
  }
  return removeMediaPaths(supabase, paths);
}

export async function removePublishedMedia(
  supabase: SupabaseClient,
  urls: string[],
) {
  const paths = urls.map(mediaPathFromUrl).filter((path): path is string => Boolean(path));
  return removeMediaPaths(supabase, paths);
}
