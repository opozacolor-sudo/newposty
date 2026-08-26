import { NextResponse } from "next/server";
import {
  countActiveSocialAccounts,
  logBillingEvent,
  requireAccountUser,
} from "@/lib/account-server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  const { user, supabase } = await requireAccountUser();
  if (!user || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const connected = await countActiveSocialAccounts(user.id);
  if (connected > 0) {
    return NextResponse.json({ error: "DISCONNECT_REQUIRED", connected }, { status: 409 });
  }

  const admin = createAdminSupabase();
  try {
    const { data: objects } = await admin.storage.from("media").list(user.id, { limit: 1000 });
    const paths = (objects ?? [])
      .filter((item) => Boolean(item.name))
      .map((item) => `${user.id}/${item.name}`);
    if (paths.length > 0) {
      await admin.storage.from("media").remove(paths);
    }
  } catch (error) {
    console.error("[account] media cleanup failed", error);
  }

  await admin.from("presale_purchases").update({ user_id: null }).eq("user_id", user.id);

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logBillingEvent({
    userId: null,
    email: user.email,
    kind: "delete_account",
    detail: { deletedUserId: user.id },
  });

  try {
    await supabase.auth.signOut();
  } catch {
    // Auth user is already gone.
  }
  return NextResponse.json({ ok: true });
}
