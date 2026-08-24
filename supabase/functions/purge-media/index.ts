import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const MARKER = "/storage/v1/object/public/media/";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("status, scheduled_for, created_at, media");
  if (postsError) {
    return Response.json({ error: postsError.message }, { status: 500 });
  }

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
      const index = url.indexOf(MARKER);
      if (index >= 0) keep.add(decodeURIComponent(url.slice(index + MARKER.length)));
    }
  }

  const { data: roots, error: listError } = await supabase.storage.from("media").list("", {
    limit: 1000,
  });
  if (listError) {
    return Response.json({ error: listError.message }, { status: 500 });
  }

  const objects: { name: string; created_at?: string }[] = [];
  for (const root of roots ?? []) {
    if (!root.id) {
      const { data: files, error: folderError } = await supabase.storage
        .from("media")
        .list(root.name, { limit: 1000 });
      if (folderError) {
        return Response.json({ error: folderError.message }, { status: 500 });
      }
      for (const file of files ?? []) {
        if (!file.id) continue;
        objects.push({ name: `${root.name}/${file.name}`, created_at: file.created_at });
      }
      continue;
    }
    objects.push({ name: root.name, created_at: root.created_at });
  }

  const staleMs = 15 * 60 * 1000;
  const paths = objects
    .filter((object) => {
      if (keep.has(object.name)) return false;
      const created = object.created_at ? new Date(object.created_at).getTime() : 0;
      return now - created >= staleMs;
    })
    .map((object) => object.name);

  if (paths.length === 0) {
    return Response.json({ removed: 0, kept: keep.size, scanned: objects?.length ?? 0 });
  }

  const { error: removeError } = await supabase.storage.from("media").remove(paths);
  if (removeError) {
    return Response.json({ error: removeError.message, paths }, { status: 500 });
  }

  return Response.json({
    removed: paths.length,
    kept: keep.size,
    scanned: objects?.length ?? 0,
    paths,
  });
});
