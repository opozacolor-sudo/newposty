import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getZernioApiKey } from "@/lib/env";
import { createPost, getPost, presignMedia, type ZernioMediaItem } from "@/lib/zernio";

type MediaInput = { url: string; type: "image" | "video" };

function mapStatus(zernioStatus: string | undefined, publishNow: boolean) {
  if (zernioStatus) return zernioStatus;
  return publishNow ? "publishing" : "scheduled";
}

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    getZernioApiKey();
  } catch {
    return NextResponse.json(
      { error: "ZERNIO_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    content?: string;
    accountIds?: string[];
    media?: MediaInput[];
    publishNow?: boolean;
    scheduledFor?: string;
    timezone?: string;
  };

  const content = body.content?.trim() ?? "";
  const accountIds = body.accountIds ?? [];
  if (!content && !(body.media && body.media.length > 0)) {
    return NextResponse.json({ error: "Write a caption or attach media." }, { status: 400 });
  }
  if (accountIds.length === 0) {
    return NextResponse.json({ error: "Pick at least one connected account." }, { status: 400 });
  }

  const { data: accounts, error: accountError } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", user.id)
    .in("id", accountIds);

  if (accountError) {
    return NextResponse.json({ error: accountError.message }, { status: 500 });
  }
  if (!accounts || accounts.length === 0) {
    return NextResponse.json({ error: "Those accounts were not found." }, { status: 400 });
  }

  const scheduledFor = body.scheduledFor
    ? body.scheduledFor.length === 16
      ? `${body.scheduledFor}:00`
      : body.scheduledFor
    : undefined;
  const publishNow = Boolean(body.publishNow) && !scheduledFor;
  const timezone = body.timezone || "UTC";
  const mediaItems: ZernioMediaItem[] = (body.media ?? []).map((item) => ({
    url: item.url,
    type: item.type,
  }));

  const zernioPost = await createPost({
    content,
    platforms: accounts.map((account) => ({
      platform: account.platform as string,
      accountId: account.zernio_account_id as string,
    })),
    mediaItems: mediaItems.length > 0 ? mediaItems : undefined,
    publishNow,
    scheduledFor,
    timezone,
  });

  const status = mapStatus(zernioPost.status, publishNow);
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content,
      media: mediaItems,
      status,
      scheduled_for: scheduledFor ?? null,
      timezone,
      zernio_post_id: zernioPost._id,
      platform_results: zernioPost.platforms ?? [],
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post });
}

export async function PATCH(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { postId?: string };
  if (!body.postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("posts")
    .select("*")
    .eq("id", body.postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing?.zernio_post_id) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const zernioPost = await getPost(existing.zernio_post_id as string);
  const { data: post, error } = await supabase
    .from("posts")
    .update({
      status: zernioPost.status ?? existing.status,
      platform_results: zernioPost.platforms ?? existing.platform_results,
    })
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post });
}
