import { Link } from "@/i18n/navigation";
import { legalPages, type LegalPage } from "@/lib/legal";

export function LegalDocument({ page, locale }: { page: LegalPage; locale: string }) {
  const pages = legalPages(locale);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {pages.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={
              item.id === page.id
                ? "font-medium text-neutral-950"
                : "font-medium text-neutral-500 hover:text-neutral-950"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">{page.title}</h1>
      <p className="mt-4 text-sm text-neutral-500">{page.updated}</p>
      <div className="mt-8 space-y-4">
        {page.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-base leading-8 text-neutral-600">
            {paragraph}
          </p>
        ))}
      </div>
      <ol className="mt-8 space-y-2 border-y border-neutral-100 py-5">
        {page.sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className="text-sm font-medium text-[#FF4713] hover:underline">
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
      <div className="mt-10 space-y-10">
        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-3 text-base leading-8 text-neutral-600">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
