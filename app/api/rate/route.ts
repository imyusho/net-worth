import { JSDOM } from "jsdom";
import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function GET(req: Request) {
  try {
    const url =
      "https://www.xe.com/en-ca/currencyconverter/convert/?Amount=1&From=CAD&To=TWD";
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Next.js scraper bot)",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch source: ${response.status}`);
    }
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const raw = document.querySelector('[data-testid="conversion"]')?.firstChild
      ?.firstChild?.firstChild?.childNodes[1]?.firstChild?.textContent;

    if (!raw) throw new Error("Can't find conversion");

    const rate = parseFloat(raw);
    return NextResponse.json({ rate });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) ?? "unknown error" },
      { status: 500 }
    );
  }
}
