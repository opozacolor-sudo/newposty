import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json({ error: "PRESALE_CLOSED" }, { status: 410 });
}
