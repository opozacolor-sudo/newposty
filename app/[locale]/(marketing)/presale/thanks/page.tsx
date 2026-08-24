import { Suspense } from "react";
import type { Metadata } from "next";
import { PresaleThanks } from "@/components/presale/presale-thanks";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PresaleThanksPage() {
  return (
    <Suspense>
      <PresaleThanks />
    </Suspense>
  );
}
