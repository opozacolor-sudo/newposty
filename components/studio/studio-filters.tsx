import type { ReactNode } from "react";

export function FilterForm({
  children,
  submit,
}: {
  children: ReactNode;
  submit: string;
}) {
  return (
    <form className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-end gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
      {children}
      <button
        type="submit"
        className="col-span-2 h-9 rounded-full bg-[#1A1A1A] px-4 text-sm font-medium text-white sm:h-10 sm:w-auto"
      >
        {submit}
      </button>
    </form>
  );
}

export function FilterField({
  label,
  children,
  wide,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label
      className={`flex min-w-0 flex-col gap-1 text-[11px] font-medium text-neutral-500 sm:min-w-[9rem] sm:text-xs ${
        wide ? "col-span-2 sm:min-w-[14rem]" : ""
      }`}
    >
      {label}
      {children}
    </label>
  );
}

export const filterControl =
  "h-9 w-full min-w-0 rounded-lg border border-neutral-200 bg-white px-2.5 text-sm text-neutral-900 sm:h-10 sm:w-auto sm:min-w-[9rem] sm:rounded-xl sm:px-3";

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
