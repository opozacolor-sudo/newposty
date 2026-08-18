import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { createZernioProfile, listAccounts } from "@/lib/zernio";

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  brand_name: string | null;
  brand_voice: string | null;
  timezone: string;
  zernio_profile_id: string | null;
};

export async function requireUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/login", locale });
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

export async function getProfile(userId: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data as Profile | null;
}

export async function ensureProfile(userId: string, email: string | undefined) {
  const supabase = await createServerSupabase();
  const existing = await getProfile(userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email: email ?? null,
      display_name: email?.split("@")[0] ?? "Creator",
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function ensureZernioProfile(userId: string, email: string | undefined) {
  const supabase = await createServerSupabase();
  const profile = await ensureProfile(userId, email);
  if (profile.zernio_profile_id) return profile;

  const created = await createZernioProfile(
    `user_${userId.replaceAll("-", "").slice(0, 24)}`,
    email ?? userId,
  );

  const { data, error } = await supabase
    .from("profiles")
    .update({ zernio_profile_id: created._id })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function syncSocialAccounts(userId: string, zernioProfileId: string) {
  const supabase = await createServerSupabase();
  const accounts = await listAccounts(zernioProfileId);

  for (const account of accounts) {
    const { error } = await supabase.from("social_accounts").upsert(
      {
        user_id: userId,
        platform: account.platform,
        zernio_account_id: account._id,
        username: account.username ?? null,
        display_name: account.displayName ?? null,
        avatar_url: account.profilePicture ?? null,
        is_active: account.isActive !== false,
      },
      { onConflict: "user_id,zernio_account_id" },
    );
    if (error) throw error;
  }

  const { data } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("connected_at", { ascending: false });

  return data ?? [];
}
