"use client";

import { useMemo, useState } from "react";
import type { TokenRow } from "@/lib/market";
import {
  formatUsd,
  formatPrice,
  formatNumber,
  formatDate,
} from "@/lib/format";

type SortKey =
  | "marketCap"
  | "name"
  | "price"
  | "priceChange24h"
  | "supply"
  | "launchedOn"
  | "holders";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "priceChange24h", label: "24h %" },
  { key: "marketCap", label: "Market Cap" },
  { key: "supply", label: "Supply" },
  { key: "launchedOn", label: "Launched On" },
  { key: "holders", label: "Holders" },
];

export default function UnstableTable({ rows }: { rows: TokenRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [asc, setAsc] = useState(false);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      // sensible defaults: text/date ascending, numbers descending
      setAsc(key === "name" || key === "launchedOn");
    }
  }

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let va: string | number | null;
      let vb: string | number | null;
      if (sortKey === "name") {
        va = a.name.toLowerCase();
        vb = b.name.toLowerCase();
      } else if (sortKey === "launchedOn") {
        va = a.launchedOn;
        vb = b.launchedOn;
      } else {
        va = a[sortKey];
        vb = b[sortKey];
      }
      if (va === null || va === undefined) return 1;
      if (vb === null || vb === undefined) return -1;
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, asc]);

  // rank is always by market cap, regardless of current sort
  const rankByMcap = useMemo(() => {
    const order = [...rows].sort(
      (a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0)
    );
    return new Map(order.map((r, i) => [r.id, i + 1]));
  }, [rows]);

  return (
    <div className="table-card">
      <div className="table-scroll">
        <table className="coins">
          <caption className="sr-only" style={{ display: "none" }}>
            Unstablecoins ranked by market capitalization
          </caption>
          <thead>
            <tr>
              <th scope="col" aria-label="Rank">
                #
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="sortable"
                  onClick={() => onSort(c.key)}
                  aria-sort={
                    sortKey === c.key
                      ? asc
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  {c.label}
                  {sortKey === c.key && (
                    <span className="arrow" aria-hidden="true">
                      {asc ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => (
              <tr key={t.id}>
                <td className="rank">{rankByMcap.get(t.id)}</td>
                <td>
                  <a
                    className="coin-link"
                    href={t.website}
                    target="_blank"
                    rel="noopener"
                    title={`${t.name} official website`}
                  >
                    <span className="coin-cell">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.logo}
                        alt={`${t.name} (${t.symbol}) logo`}
                        width={32}
                        height={32}
                        loading="lazy"
                      />
                      <span className="names">
                        <span className="name">
                          {t.name}
                          <span className="chain-badge">{t.chainLabel}</span>
                        </span>
                        <span className="symbol">{t.symbol}</span>
                      </span>
                    </span>
                  </a>
                </td>
                <td>{formatPrice(t.price)}</td>
                <td>
                  {t.priceChange24h === null ? (
                    <span className="muted">—</span>
                  ) : (
                    <span
                      className={
                        t.priceChange24h >= 0 ? "pct-up" : "pct-down"
                      }
                    >
                      {t.priceChange24h >= 0 ? "▲" : "▼"}{" "}
                      {Math.abs(t.priceChange24h).toFixed(2)}%
                    </span>
                  )}
                </td>
                <td>
                  <strong>{formatUsd(t.marketCap)}</strong>
                </td>
                <td>
                  {formatNumber(t.supply)}{" "}
                  <span className="muted">{t.symbol}</span>
                </td>
                <td>{formatDate(t.launchedOn)}</td>
                <td>{formatNumber(t.holders)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footnote">
        Live market data from DexScreener · holders from Blockscout &amp;
        Solscan · refreshed every ~5 minutes. Click a column to sort, click a
        coin to visit its official site.
      </div>
    </div>
  );
}
