import { NextResponse } from "next/server";
import { getZernioProfileId } from "@/lib/account-server";
import { loadStudioScopeWithProfile, loadOwnedCommentThread } from "@/lib/studio-feed";
import { ownsAccount } from "@/lib/studio-scope";
import { getRequestAuth } from "@/lib/supabase/server";
import { replyToComment } from "@/lib/zernio";

export async function POST(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { postId?: unknown; accountId?: unknown; message?: unknown; commentId?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const postId = String(payload.postId ?? "").trim();
  const accountId = String(payload.accountId ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const commentId = String(payload.commentId ?? "").trim();
  if (!postId || !accountId || message.length < 1 || message.length > 2000) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const scope = await loadStudioScopeWithProfile(user.id, await getZernioProfileId(user.id));
  if (!ownsAccount(scope.ownedIds, accountId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const thread = await loadOwnedCommentThread(scope, postId, accountId);
  if (thread.error === "unknown") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await replyToComment({
      postId,
      accountId,
      message,
      commentId: commentId || undefined,
    });
  } catch {
    return NextResponse.json({ error: "Could not reply" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
