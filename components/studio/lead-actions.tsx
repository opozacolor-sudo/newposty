"use client";

import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

export function LeadStatusForm({
  id,
  status,
  labels,
}: {
  id: string;
  status: string;
  labels: { new: string; contacted: string; dismissed: string };
}) {
  const router = useRouter();
  const [pending, setPending] = useState(status);

  return (
    <select
      className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs"
      value={pending}
      onChange={async (event) => {
        const next = event.target.value;
        setPending(next);
        await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: next }),
        });
        router.refresh();
      }}
    >
      <option value="new">{labels.new}</option>
      <option value="contacted">{labels.contacted}</option>
      <option value="dismissed">{labels.dismissed}</option>
    </select>
  );
}

export function LeadPlaybookForm({
  productName,
  productPrice,
  labels,
}: {
  productName: string;
  productPrice: string;
  labels: { product: string; price: string; save: string };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="mt-4 flex flex-wrap items-end gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setSaving(true);
        await fetch("/api/leads", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_name: form.get("product_name"),
            product_price: form.get("product_price"),
          }),
        });
        setSaving(false);
        router.refresh();
      }}
    >
      <label className="text-xs text-neutral-500">
        {labels.product}
        <input
          name="product_name"
          defaultValue={productName}
          className="mt-1 block w-56 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-900"
        />
      </label>
      <label className="text-xs text-neutral-500">
        {labels.price}
        <input
          name="product_price"
          type="number"
          min="0"
          step="1"
          defaultValue={productPrice}
          className="mt-1 block w-32 rounded-lg border border-neutral-200 px-2 py-1.5 text-sm text-neutral-900"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-[#FF4713] px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {labels.save}
      </button>
    </form>
  );
}
