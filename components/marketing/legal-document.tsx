import { MarketingPageFrame } from "@/components/marketing/page-frame";
import { clayLink, pageBody, pageH2, pageTitle } from "@/components/marketing/styles";
import { Link } from "@/i18n/navigation";
import { legalPages, type LegalPage } from "@/lib/legal";

export function LegalDocument({ page, locale }: { page: LegalPage; locale: string }) {
  const pages = legalPages(locale);

  return (
    <MarketingPageFrame>
      <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {pages.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={
              item.id === page.id
                ? "font-medium text-[#1d1d1f]"
                : "font-medium text-[#6e6e73] hover:text-[#1d1d1f]"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <h1 className={`mt-8 ${pageTitle}`}>{page.title}</h1>
      <p className="mt-4 text-sm text-[#6e6e73]">{page.updated}</p>
      <div className="mt-8 space-y-4">
        {page.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className={pageBody}>
            {paragraph}
          </p>
        ))}
      </div>
      <ol className="mt-8 space-y-2 border-y border-white/20 py-5">
        {page.sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className={clayLink}>
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
      <div className="mt-10 space-y-10">
        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className={pageH2}>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className={`mt-3 ${pageBody}`}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </MarketingPageFrame>
  );
}
