"use client";

import { BarChart3, Megaphone, Mic, Send, Sparkles, Users, type LucideIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { FEATURES, type FeatureIcon } from "@/lib/features";
import { Link } from "@/i18n/navigation";

const ICONS: Record<FeatureIcon, LucideIcon> = {
  sparkles: Sparkles,
  mic: Mic,
  send: Send,
  chart: BarChart3,
  megaphone: Megaphone,
  users: Users,
};

export function FeaturesPanel({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale() === "ro" ? "ro" : "en";

  return (
    <ul className="grid gap-1 sm:grid-cols-2">
      {FEATURES.map((page) => {
        const copy = page[locale];
        const Icon = ICONS[page.icon];
        return (
          <li key={page.slug}>
            <Link
              href={`/features/${page.slug}`}
              onClick={onNavigate}
              className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-neutral-50"
            >
              <Icon size={18} className="mt-0.5 shrink-0 text-neutral-700" aria-hidden />
              <span>
                <span className="block text-sm font-semibold text-neutral-950">{copy.navTitle}</span>
                <span className="mt-0.5 block text-[13px] leading-5 text-neutral-500">{copy.navBody}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
