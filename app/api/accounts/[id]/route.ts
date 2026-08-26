import { NextResponse } from "next/server";
import { requireAccountUser } from "@/lib/account-server";
import { disconnectAccount, ZernioError } from "@/lib/zernio";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const { user, supabase } = await requireAccountUser();
  if (!user || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: account } = await supabase
    .from("social_accounts")
    .select("id, zernio_account_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!account) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  try {
    await disconnectAccount(String(account.zernio_account_id));
  } catch (error) {
    if (!(error instanceof ZernioError) || (error.status !== 404 && error.status !== 405)) {
      const message = error instanceof Error ? error.message : "DISCONNECT_FAILED";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  const { error } = await supabase
    .from("social_accounts")
    .update({ is_active: false })
    .eq("id", account.id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
