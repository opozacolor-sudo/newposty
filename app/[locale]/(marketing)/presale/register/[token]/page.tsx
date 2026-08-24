import type { Metadata } from "next";
import { PresaleRegisterForm } from "@/components/presale/presale-register-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PresaleRegisterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PresaleRegisterForm token={decodeURIComponent(token)} />;
}
