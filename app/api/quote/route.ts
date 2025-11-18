import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const symbols = searchParams.get("symbols"); // e.g. symbols=2330.TW,QQC.TO,ZSP.TO

  const apiKey = process.env.NINJAS_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  const headers = { "X-Api-Key": apiKey };

  // Helper to fetch a single price from API Ninjas
  async function fetchPrice(s: string) {
    try {
      const url = `https://api.api-ninjas.com/v1/stockprice?ticker=${s}`;
      const res = await fetch(url, { headers, cache: "no-store" });
      const data = await res.json();
      if (typeof data.price === "number") return data.price;
    } catch (e) {
      console.error("Error fetching price for", s, e);
    }
    return null;
  }

  // Multi-symbol support
  if (symbols) {
    const syms = symbols.split(",");
    const results: Record<string, number | null> = {};
    await Promise.all(
      syms.map(async (s) => {
        results[s] = await fetchPrice(s);
      })
    );

    // Remove all TWD→CAD logic.
    return NextResponse.json({ prices: results });
  }

  if (!symbol) {
    return NextResponse.json(
      { error: "symbol or symbols is required" },
      { status: 400 }
    );
  }
  const price = await fetchPrice(symbol);
  return NextResponse.json({ price });
}
