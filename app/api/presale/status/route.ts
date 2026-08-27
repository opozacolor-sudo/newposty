import { NextResponse } from "next/server";
import { fetchPresaleView } from "@/lib/presale-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const view = await fetchPresaleView();
    return NextResponse.json(view);
  } catch {
    return NextResponse.json({ error: "Could not load presale status." }, { status: 500 });
  }
}
