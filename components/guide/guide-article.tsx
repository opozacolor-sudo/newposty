import { Mic } from "lucide-react";
import type { GuideDoc, GuideSection } from "@/lib/guide-content";
import { btnSolid } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";

function TipBox({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <aside className="min-w-0 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3.5 sm:px-5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9A3412]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#1A1A1A]">{title}</p>
      <p className="mt-1 text-sm leading-6 break-words text-[#6B7280]">{body}</p>
    </aside>
  );
}

function SectionBlock({
  section,
  guide,
}: {
  section: GuideSection;
  guide: GuideDoc;
}) {
  const isVoice = section.featured === "voice";

  return (
    <section
      id={section.id}
      className={`min-w-0 scroll-mt-24 ${
        isVoice
          ? "rounded-3xl border border-[#FF4713]/20 bg-gradient-to-br from-[#FFF4F0] to-white p-5 sm:p-8"
          : ""
      }`}
    >
      {isVoice ? (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FF4713] px-3 py-1 text-xs font-medium text-white">
          <Mic size={14} />
          {section.title}
        </div>
      ) : (
        <h2 className="text-2xl font-semibold tracking-tight break-words text-neutral-950 sm:text-3xl">
          {section.title}
        </h2>
      )}
      {isVoice ? (
        <h2 className="text-2xl font-semibold tracking-tight break-words text-neutral-950 sm:text-3xl">
          {section.lead}
        </h2>
      ) : section.lead ? (
        <p className="mt-3 text-base font-medium leading-7 break-words text-neutral-800">{section.lead}</p>
      ) : null}

      <div className="mt-4 space-y-4 text-base leading-7 break-words text-neutral-600">
        {section.body.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      {section.networks ? (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {section.networks.map((network) => (
            <li
              key={network.name}
              className="min-w-0 rounded-2xl border border-neutral-100 bg-[#FAFAFA] p-4"
            >
              <p className="font-semibold text-neutral-950">{network.name}</p>
              <dl className="mt-3 space-y-2 text-sm leading-6 break-words text-neutral-600">
                <div>
                  <dt className="font-medium text-neutral-800">{guide.networkLabels.can}</dt>
                  <dd className="min-w-0">{network.can}</dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-800">{guide.networkLabels.boost}</dt>
                  <dd className="min-w-0">{network.boost}</dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-800">{guide.networkLabels.audiences}</dt>
                  <dd className="min-w-0">{network.audiences}</dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-800">{guide.networkLabels.stats}</dt>
                  <dd className="min-w-0">{network.stats}</dd>
                </div>
                {network.note ? <p className="text-[#9A3412]">{network.note}</p> : null}
              </dl>
            </li>
          ))}
        </ul>
      ) : null}

      {section.tips?.length ? (
        <div className="mt-5 space-y-3">
          {section.tips.map((tip) => (
            <TipBox key={tip.title} label={guide.tipLabel} title={tip.title} body={tip.body} />
          ))}
        </div>
      ) : null}

      {section.examples?.length ? (
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#FF4713]">
            {guide.tryLabel}
          </p>
          <ul className="mt-2 space-y-2">
            {section.examples.map((example) => (
              <li
                key={example}
                className="min-w-0 rounded-2xl border border-neutral-100 bg-white px-4 py-3 text-sm leading-6 break-words text-neutral-800"
              >
                {guide.quoteStart}
                {example}
                {guide.quoteEnd}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function GuideArticle({
  guide,
  variant,
}: {
  guide: GuideDoc;
  variant: "marketing" | "studio";
}) {
  const padded = variant === "marketing" ? "px-4 py-10 sm:px-6 sm:py-16 lg:py-20" : "px-4 py-8 sm:px-6";

  return (
    <div className={`mx-auto w-full min-w-0 max-w-6xl ${padded}`}>
      <header className={variant === "marketing" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        <h1 className="text-3xl font-semibold tracking-tight break-words text-neutral-950 sm:text-4xl lg:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-3 text-base leading-7 break-words text-neutral-500 sm:text-lg">{guide.subtitle}</p>
        <p className="mt-4">
          <a
            href={guide.pdfHref}
            download
            className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:border-[#FF4713] hover:text-[#FF4713]"
          >
            {guide.downloadLabel}
          </a>
        </p>
      </header>

      <div className="mt-10 grid min-w-0 grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
        <nav
          aria-label={guide.toc}
          className={`min-w-0 ${
            variant === "marketing" ? "lg:sticky lg:top-20 lg:self-start" : "lg:sticky lg:top-4 lg:self-start"
          }`}
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
            {guide.toc}
          </p>
          <ol className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:block lg:space-y-1">
            {guide.sections.map((section, index) => (
              <li key={section.id} className="min-w-0">
                <a
                  href={`#${section.id}`}
                  className="flex min-w-0 items-start gap-2 rounded-xl px-2 py-1.5 text-sm text-neutral-600 hover:bg-[#FFF4F0] hover:text-[#FF4713] sm:px-3"
                >
                  <span className="mt-0.5 w-5 shrink-0 text-[11px] tabular-nums text-[#FF4713]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 break-words">{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="min-w-0 space-y-14 sm:space-y-16">
          {guide.sections.map((section) => (
            <SectionBlock key={section.id} section={section} guide={guide} />
          ))}
        </article>
      </div>

      <div className="mt-16 border-t border-neutral-100 py-12 text-center sm:mt-20">
        <p className="text-2xl font-semibold tracking-tight text-neutral-950">{guide.ctaTitle}</p>
        <div className="mt-6 flex justify-center">
          <Link href="/chat" className={`${btnSolid} px-6 py-3`}>
            {guide.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
