import { getTranslations } from "next-intl/server";

export async function ComingSoon({ title }: { title: string }) {
  const t = await getTranslations("ComingSoon");

  return (
    <main className="px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">{title}</h1>
      <p className="mt-3 max-w-md text-sm text-[#6B7280]">{t("body")}</p>
      <div className="mt-8 rounded-2xl border border-dashed border-[#E5E5E5] bg-[#FAFAFA] px-6 py-16 text-center text-sm text-[#6B7280]">
        {t("badge")}
      </div>
    </main>
  );
}
