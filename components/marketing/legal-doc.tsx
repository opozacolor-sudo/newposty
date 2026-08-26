type LegalSection = {
  heading: string;
  body: string[];
};

export function LegalDoc({
  title,
  updated,
  operator,
  sections,
}: {
  title: string;
  updated: string;
  operator: string;
  sections: LegalSection[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-neutral-500">{operator}</p>
      <p className="mt-1 text-sm text-neutral-500">{updated}</p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <article key={section.heading}>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-3 text-base leading-8 text-neutral-600">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
