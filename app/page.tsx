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

  const [rate, setRate] = useState<number>();

  const [holdings, setHoldings] = useState({
    tw2330Shares: 4940,
    qqcShares: 5545.2095 + 1153,
    zspShares: 64.8749,
    twd: 40000,
    cad: 819 + 6400 + 6000,
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/quote?symbols=2330.TW,QQC.TO,ZSP.TO");
      const data = await res.json();
      setPrices({
        "2330.TW": data.prices["2330.TW"],
        "QQC.TO": data.prices["QQC.TO"],
        "ZSP.TO": data.prices["ZSP.TO"],
      });

      const rateRes = await fetch("/api/rate");
      const rateData = await rateRes.json();
      setRate(rateData.rate);
    }
    load();
  }, []);

  const t2330 = prices["2330.TW"];
  const tQQC = prices["QQC.TO"];
  const tZSP = prices["ZSP.TO"];

  let computedNetworth: number | null = null;
  if (t2330 !== null && tQQC !== null && tZSP !== null && rate != null) {
    computedNetworth =
      holdings.tw2330Shares * t2330 +
      (holdings.qqcShares * tQQC + holdings.zspShares * tZSP + holdings.cad) *
        rate +
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

      <div className="pt-4 space-y-1">
        <p>2330.TW price: {prices["2330.TW"] ?? "Loading..."}</p>
        <p>QQC.TO price: {prices["QQC.TO"] ?? "Loading..."}</p>
        <p>ZSP.TO price: {prices["ZSP.TO"] ?? "Loading..."}</p>
        <p>CAD→TWD exchange rate: {rate ?? "Loading..."}</p>
      </div>

      <div className="space-y-2">
        <label>2330.TW shares:</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={holdings.tw2330Shares}
          onChange={(e) =>
            setHoldings({ ...holdings, tw2330Shares: Number(e.target.value) })
          }
        />

        <label>QQC.TO shares:</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={holdings.qqcShares}
          onChange={(e) =>
            setHoldings({ ...holdings, qqcShares: Number(e.target.value) })
          }
        />

        <label>ZSP.TO shares:</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={holdings.zspShares}
          onChange={(e) =>
            setHoldings({ ...holdings, zspShares: Number(e.target.value) })
          }
        />

        <label>TWD cash:</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={holdings.twd}
          onChange={(e) =>
            setHoldings({ ...holdings, twd: Number(e.target.value) })
          }
        />

        <label>CAD cash:</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={holdings.cad}
          onChange={(e) =>
            setHoldings({ ...holdings, cad: Number(e.target.value) })
          }
        />
      </div>
    </div>
  );
}
