"use client";

import { useLocale } from "next-intl";
import { MADE_FOR } from "@/lib/made-for";
import { Link } from "@/i18n/navigation";

export function MadeForPanel({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale() === "ro" ? "ro" : "en";

  return (
    <ul className="grid gap-1 sm:grid-cols-2">
      {MADE_FOR.map((page) => {
        const copy = page[locale];
        return (
          <li key={page.slug}>
            <Link
              href={`/made-for/${page.slug}`}
              onClick={onNavigate}
              className="block rounded-xl px-3 py-2.5 hover:bg-neutral-50"
            >
              <span className="block text-sm font-semibold text-neutral-950">{copy.navTitle}</span>
              <span className="mt-0.5 block text-[13px] leading-5 text-neutral-500">{copy.navBody}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
