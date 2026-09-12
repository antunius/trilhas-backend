import { NextResponse } from "next/server";
import { isDevBypass } from "@/lib/dev";
import { loadSimuladorBank } from "@/lib/load-gate-bank";

export async function GET(request: Request) {
  if (!isDevBypass()) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const track = new URL(request.url).searchParams.get("track");
  if (track !== "kafka" && track !== "arquitetura") {
    return NextResponse.json({ topics: {}, questions: [] });
  }
  return NextResponse.json(loadSimuladorBank(track));
}
