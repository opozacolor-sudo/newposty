import { NextResponse } from "next/server";
import { fetchPresaleView } from "@/lib/presale-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const view = await fetchPresaleView();
    return NextResponse.json(view);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load presale status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
