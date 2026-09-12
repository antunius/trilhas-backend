import { NextResponse } from "next/server";
import { isDevBypass } from "@/lib/dev";
import { loadGateBank } from "@/lib/load-gate-bank";

export async function GET(request: Request) {
  if (!isDevBypass()) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const parts = path.split("/").filter(Boolean);
  const track = parts[0];
  const slug = parts[1];
  if (track !== "kafka" && track !== "arquitetura") {
    return NextResponse.json([]);
  }
  if (!slug) return NextResponse.json([]);
  return NextResponse.json(loadGateBank(track, slug));
}
