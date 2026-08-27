"use client";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-base text-neutral-600">Something went wrong. Please try again.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-[#FF4713] px-4 py-2 text-sm text-white"
      >
        Try again
      </button>
    </section>
  );
}
