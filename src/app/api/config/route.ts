import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    haUrl: process.env.HA_WEBSOCKET_URL || process.env.NEXT_PUBLIC_HA_URL || "",
    haToken:
      process.env.HA_ACCESS_TOKEN || process.env.NEXT_PUBLIC_HA_TOKEN || "",
  });
}

export const dynamic = "force-dynamic";
