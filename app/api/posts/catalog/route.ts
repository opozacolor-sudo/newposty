import { NextResponse } from "next/server";
import { createGeneratedPoster } from "@/lib/chat-post/poster";
import { catalogCaption } from "@/lib/chat-post/catalog";
import { resolveCreateActions } from "@/lib/chat-post/resolve";
import { savePendingAction } from "@/lib/chat-post/store";
import type { CatalogPlanPayload, ChatMedia } from "@/lib/chat-post/types";
import { getAnthropicApiKey, hasFalKey } from "@/lib/env";
import { userTimezone } from "@/lib/chat-post/timezone";
import { localeFromRequest } from "@/lib/locale-time";
import { applyClientScope, asRows, loadWorkspace } from "@/lib/clients";
import { isAdsPlatformId, isConnectDisabled } from "@/lib/platforms";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 300;

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const locale = localeFromRequest(request);
  if (!hasFalKey()) {
    return NextResponse.json(
      {
        error:
          locale === "ro"
            ? "Generarea de poze e oprită până e credit pe cont."
            : "Photo generation stays off until image credit is loaded.",
      },
      { status: 409 },
    );
  }

  const body = (await request.json()) as {
    conversationId?: string;
    plan?: CatalogPlanPayload;
    locale?: string;
  };
  const plan = body.plan;
  if (!body.conversationId || !plan?.products?.length || !plan.site_url) {
    return NextResponse.json({ error: "plan is required" }, { status: 400 });
  }

  const workspace = await loadWorkspace(supabase, user.id);
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const { data: accountRows } = await applyClientScope(
    supabase
      .from("social_accounts")
      .select("id, platform, username, display_name, zernio_account_id")
      .eq("user_id", user.id)
      .eq("is_active", true),
    workspace,
  );
  const posting = asRows<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
    zernio_account_id: string | null;
  }>(accountRows).filter(
    (account) =>
      !isAdsPlatformId(String(account.platform)) &&
      !isConnectDisabled(String(account.platform)) &&
      typeof account.zernio_account_id === "string",
  ) as Array<{
    id: string;
    platform: string;
    username: string | null;
    display_name: string | null;
    zernio_account_id: string;
  }>;

  const items: Array<{ media: ChatMedia; caption: string }> = [];
  for (let index = 0; index < plan.products.length; index += 2) {
    const batch = plan.products.slice(index, index + 2);
    const made = await Promise.all(
      batch.map((product) =>
        createGeneratedPoster({
          supabase,
          userId: user.id,
          conversationId: body.conversationId as string,
          locale,
          brief: `${product.name}. ${product.description}`.trim(),
          siteUrl: product.url || plan.site_url,
          headline: product.name,
          brandName: profile?.brand_name as string | null,
          references: product.imageUrl
            ? [{ id: `ref-${product.url}`, url: product.imageUrl, type: "image", name: product.name }]
            : [],
        }),
      ),
    );
    made.forEach((result, offset) => {
      if (!result.ok) return;
      const product = batch[offset];
      items.push({
        media: result.payload.media,
        caption: catalogCaption({
          product,
          siteUrl: plan.site_url,
          locale,
          includeLink: plan.include_link,
        }),
      });
    });
  }

  if (items.length === 0) {
    return NextResponse.json(
      {
        error:
          locale === "ro"
            ? "Nu am putut genera pozele. Verifică creditul și reîncearcă."
            : "I could not generate the photos. Check credit and try again.",
      },
      { status: 502 },
    );
  }

  const resolved = await resolveCreateActions({
    actions: [
      {
        mode: "schedule",
        cadence: "catalog",
        use_best_time: true,
        platforms: ["__all_connected__"],
        site_url: plan.site_url,
        catalog_items: items.map((item) => ({
          media_id: item.media.id,
          caption: item.caption,
        })),
        caption_source: "ai_generated",
      },
    ],
    accounts: posting,
    media: items.map((item) => item.media),
    locale,
    timezone: userTimezone(profile?.timezone as string | undefined),
    apiKey: getAnthropicApiKey(),
    brandName: profile?.brand_name as string | null,
    brandVoice: profile?.brand_voice as string | null,
    fallbackBrief: locale === "ro" ? "câte una pe zi, catalog produse" : "one product a day catalog",
    keepToolCaption: true,
  });

  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  const saved = await savePendingAction({
    supabase,
    userId: user.id,
    conversationId: body.conversationId,
    resolved: resolved.resolved,
  });

  return NextResponse.json({
    type: "confirmation",
    action_id: saved.action_id,
    resolved: saved,
    generated: items.length,
  });
}
