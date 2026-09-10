import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "PRESALE_CLOSED" }, { status: 410 });
}
