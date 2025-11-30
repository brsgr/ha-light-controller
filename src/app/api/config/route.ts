import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    haUrl: process.env.NEXT_PUBLIC_HA_URL || "",
    haToken: process.env.NEXT_PUBLIC_HA_TOKEN || "",
  });
}

export const dynamic = "force-dynamic";
