import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const year =
    req.nextUrl.searchParams.get("year") ?? String(new Date().getFullYear());

  try {
    const res = await fetch(
      `https://api-hari-libur.vercel.app/api?year=${encodeURIComponent(year)}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      return NextResponse.json({ holidays: [] });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ holidays: [] });
  }
}
