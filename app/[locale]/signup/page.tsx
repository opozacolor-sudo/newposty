import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { SIGNUPS_OPEN } from "@/lib/flags";
import SignupForm from "./signup-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  if (!SIGNUPS_OPEN) {
    const locale = await getLocale();
    redirect({ href: "/waitlist", locale });
  }

  return <SignupForm />;
}
