import type { ReactNode } from "react";

export function FilterForm({
  children,
  submit,
}: {
  children: ReactNode;
  submit: string;
}) {
  return (
    <form className="mt-6 flex flex-wrap items-end gap-3">
      {children}
      <button type="submit" className="rounded-full bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white">
        {submit}
      </button>
    </form>
  );
}

export function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-[9rem] flex-col gap-1 text-xs font-medium text-neutral-500">
      {label}
      {children}
    </label>
  );
}

export const filterControl =
  "rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900";

export function StudioNotice({
  kind,
  labels,
}: {
  kind: "failed" | "unavailable" | "unknown" | null;
  labels: { failed: string; unavailable: string; unknown: string };
}) {
  if (!kind) return null;
  const text = kind === "unavailable" ? labels.unavailable : kind === "unknown" ? labels.unknown : labels.failed;
  return <p className="mt-4 text-sm text-[#FF4713]">{text}</p>;
}
