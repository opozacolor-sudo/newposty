import { NextResponse } from "next/server";
import { getZernioProfileId } from "@/lib/account-server";
import { assertOwnedConversation, loadStudioScopeWithProfile } from "@/lib/studio-feed";
import { getRequestAuth } from "@/lib/supabase/server";
import { sendConversationMessage } from "@/lib/zernio";

export async function POST(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { conversationId?: unknown; accountId?: unknown; message?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const conversationId = String(payload.conversationId ?? "").trim();
  const accountId = String(payload.accountId ?? "").trim();
  const message = String(payload.message ?? "").trim();
  if (!conversationId || !accountId || message.length < 1 || message.length > 2000) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const scope = await loadStudioScopeWithProfile(user.id, await getZernioProfileId(user.id));
  const conversation = await assertOwnedConversation(scope, conversationId, accountId).catch(() => null);
  if (!conversation) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await sendConversationMessage(conversationId, accountId, message);
  } catch {
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
