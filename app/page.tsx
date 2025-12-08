"use client";

import { useEffect, useState } from "react";

type Prices = {
  [symbol: string]: number | null;
};

export default function Home() {
  const [prices, setPrices] = useState<Prices>({
    "2330.TW": null,
    "QQC.TO": null,
    "ZSP.TO": null,
  });
  const [touchedPrices, setTouchedPrices] = useState<{ [k: string]: boolean }>(
    {}
  );

  const [rate, setRate] = useState<number | undefined>();
  const [touchedRate, setTouchedRate] = useState(false);

  const [holdings, setHoldings] = useState({
    tw2330Shares: 4940,
    qqcShares: 5545.2 + 1153,
    zspShares: 64.8749,
    twd: 154000,
    cad: 3000 + 6400 + 6000,
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/quote?symbols=2330.TW,QQC.TO,ZSP.TO");
      const data = await res.json();
      setPrices((prices) => ({
        ...prices,
        ...(Object.fromEntries(
          Object.entries(data.prices).map(([k, v]) =>
            touchedPrices[k] ? [k, prices[k]] : [k, v]
          )
        ) as Prices), // explicitly cast to Prices type
      }));

      const rateRes = await fetch("/api/rate");
      const rateData = await rateRes.json();
      if (!touchedRate) setRate(rateData.rate);
    }
    load();
    // touchedPrices in deps means useEffect re-runs only if user starts editing prices
  }, [touchedPrices, touchedRate]);

  const t2330 = prices["2330.TW"];
  const tQQC = prices["QQC.TO"];
  const tZSP = prices["ZSP.TO"];

  let computedNetworth: number | null = null;
  if (t2330 !== null && tQQC !== null && tZSP !== null) {
    computedNetworth =
      holdings.tw2330Shares * t2330 +
      (holdings.qqcShares * tQQC + holdings.zspShares * tZSP + holdings.cad) *
        (rate ?? 22.47) +
      holdings.twd;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">
        Net Worth: $
        {computedNetworth !== null
          ? computedNetworth.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "-"}
      </h1>

      <div className="pt-4 space-y-3">
        {/* 2330.TW row */}
        <div className="flex items-center gap-2">
          <label className="w-28">2330.TW</label>
          <input
            type="number"
            className="border px-2 py-1 w-20"
            value={prices["2330.TW"] ?? ""}
            onChange={(e) => {
              setPrices({ ...prices, "2330.TW": Number(e.target.value) });
              setTouchedPrices((prev) => ({ ...prev, "2330.TW": true }));
            }}
          />
          <span>&times;</span>
          <input
            type="number"
            className="border px-2 py-1 w-20"
            value={holdings.tw2330Shares}
            onChange={(e) =>
              setHoldings({ ...holdings, tw2330Shares: Number(e.target.value) })
            }
          />
          <span className="text-sm text-gray-500">shares</span>
        </div>
        {/* QQC.TO row */}
        <div className="flex items-center gap-2">
          <label className="w-28">QQC.TO</label>
          <input
            type="number"
            className="border px-2 py-1 w-20"
            value={prices["QQC.TO"] ?? ""}
            onChange={(e) => {
              setPrices({ ...prices, "QQC.TO": Number(e.target.value) });
              setTouchedPrices((prev) => ({ ...prev, "QQC.TO": true }));
            }}
          />
          <span>&times;</span>
          <input
            type="number"
            className="border px-2 py-1 w-20"
            value={holdings.qqcShares}
            onChange={(e) =>
              setHoldings({ ...holdings, qqcShares: Number(e.target.value) })
            }
          />
          <span className="text-sm text-gray-500">shares</span>
        </div>
        {/* ZSP.TO row */}
        <div className="flex items-center gap-2">
          <label className="w-28">ZSP.TO</label>
          <input
            type="number"
            className="border px-2 py-1 w-20"
            value={prices["ZSP.TO"] ?? ""}
            onChange={(e) => {
              setPrices({ ...prices, "ZSP.TO": Number(e.target.value) });
              setTouchedPrices((prev) => ({ ...prev, "ZSP.TO": true }));
            }}
          />
          <span>&times;</span>
          <input
            type="number"
            className="border px-2 py-1 w-20"
            value={holdings.zspShares}
            onChange={(e) =>
              setHoldings({ ...holdings, zspShares: Number(e.target.value) })
            }
          />
          <span className="text-sm text-gray-500">shares</span>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex items-center gap-2">
          <label className="w-28">TWD cash:</label>
          <input
            type="number"
            className="border px-2 py-1 w-20 flex-1"
            value={holdings.twd}
            onChange={(e) =>
              setHoldings({ ...holdings, twd: Number(e.target.value) })
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-28">CAD cash:</label>
          <input
            type="number"
            className="border px-2 py-1 w-20 flex-1"
            value={holdings.cad}
            onChange={(e) =>
              setHoldings({ ...holdings, cad: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <label className="w-28">CAD → TWD:</label>
          <input
            type="number"
            className="border px-2 py-1 w-20 flex-1"
            value={rate ?? ""}
            onChange={(e) => {
              setRate(Number(e.target.value));
              setTouchedRate(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}
