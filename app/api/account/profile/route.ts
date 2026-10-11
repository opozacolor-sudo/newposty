import { NextResponse } from "next/server";
import { parseProfileDetails } from "@/lib/profile-details";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload: unknown = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const details = parseProfileDetails(payload);
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: details.display_name || null,
      company_site: details.company_site || null,
      contact_email: details.contact_email || null,
      contact_phone: details.contact_phone || null,
      billing_name: details.billing_name || null,
      billing_tax_id: details.billing_tax_id || null,
      billing_address: details.billing_address || null,
      billing_city: details.billing_city || null,
      billing_postal_code: details.billing_postal_code || null,
      billing_country: details.billing_country || null,
    })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });
  return NextResponse.json({ ok: true, details });
}
