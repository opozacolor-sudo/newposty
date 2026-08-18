import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { SIGNUPS_OPEN } from "@/lib/flags";
import SignupForm from "./signup-form";

export default async function SignupPage() {
  if (!SIGNUPS_OPEN) {
    const locale = await getLocale();
    redirect({ href: "/login", locale });
  }

  return <SignupForm />;
}
