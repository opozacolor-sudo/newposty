import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-full">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-serif text-2xl italic tracking-tight">newposty</span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-muted hover:text-ink">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-4 py-2 text-sm text-paper hover:bg-black"
          >
            Start writing
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Social studio</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          Write it once.
          <span className="italic text-accent"> Post it everywhere.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-7 text-muted">
          Chat with Claude to draft captions and ideas, connect Instagram, TikTok,
          YouTube and more through Zernio, then publish or schedule from one place.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent-dark"
          >
            Create your studio
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-line bg-card px-5 py-3 text-sm hover:border-ink/20"
          >
            I already have an account
          </Link>
        </div>

        <ul className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Talk it out",
              body: "An assistant that drafts captions, riffs on ideas, and can actually send the post.",
            },
            {
              title: "One connect flow",
              body: "Zernio hosts OAuth for Instagram, Facebook, Threads, TikTok, YouTube, LinkedIn, Pinterest, and Google Business.",
            },
            {
              title: "Now or later",
              body: "Publish immediately or park it on the calendar. Same composer, same accounts.",
            },
          ].map((item) => (
            <li key={item.title} className="rounded-3xl border border-line bg-card p-6">
              <h2 className="font-serif text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
