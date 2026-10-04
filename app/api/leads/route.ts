import { NextResponse } from "next/server";
import { loadWorkspace } from "@/lib/clients";
import { createServerSupabase, getRequestAuth } from "@/lib/supabase/server";

const STATUSES = new Set(["new", "contacted", "dismissed"]);

export async function PATCH(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { id?: unknown; status?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = String(payload.id ?? "").trim();
  const status = String(payload.status ?? "").trim();
  if (!id || !STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Could not update" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const { user } = await getRequestAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: { product_name?: unknown; product_price?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const workspace = await loadWorkspace(supabase, user.id);
  const productName = String(payload.product_name ?? "").trim() || null;
  const rawPrice = payload.product_price;
  const productPrice =
    rawPrice === "" || rawPrice == null ? null : Number(rawPrice);
  if (productPrice != null && (!Number.isFinite(productPrice) || productPrice < 0)) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const clientId = workspace.clientId;
  let query = supabase.from("lead_playbooks").select("id").eq("user_id", user.id).eq("kind", "auto_credit");
  query = clientId ? query.eq("client_id", clientId) : query.is("client_id", null);
  const { data: existingRows } = await query.limit(1);
  const existing = existingRows?.[0];

  if (existing?.id) {
    const { error } = await supabase
      .from("lead_playbooks")
      .update({
        product_name: productName,
        product_price: productPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .eq("user_id", user.id);
    if (error) return NextResponse.json({ error: "Could not update" }, { status: 500 });
  } else {
    const { error } = await supabase.from("lead_playbooks").insert({
      user_id: user.id,
      client_id: clientId,
      kind: "auto_credit",
      product_name: productName,
      product_price: productPrice,
    });
    if (error) return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
