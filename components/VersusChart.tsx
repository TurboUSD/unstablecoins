"use client";

import { formatUsd } from "@/lib/format";

export interface Segment {
  label: string;
  value: number;
}

const STABLE_COLORS = [
  "#26a17b", // USDT green
  "#2775ca", // USDC blue
  "#f5ac37", // amber
  "#5b8def",
  "#48c9a9",
  "#8a93a6", // others
];

const UNSTABLE_COLORS = ["#ff9900", "#7c3aed", "#e5484d", "#04ca6a", "#ffb020"];

function pctLabel(pct: number): string {
  if (pct >= 10) return `${pct.toFixed(1)}%`;
  if (pct >= 0.1) return `${pct.toFixed(2)}%`;
  return `${pct.toFixed(3)}%`;
}

function StackBar({
  title,
  total,
  segments,
  colors,
}: {
  title: string;
  total: number;
  segments: Segment[];
  colors: string[];
}) {
  return (
    <div className="stack-block">
      <div className="stack-head">
        <span className="stack-title">{title}</span>
        <strong>{formatUsd(total)}</strong>
      </div>
      <div className="stack-bar" role="img" aria-label={`${title} composition`}>
        {segments.map((s, i) => {
          const pct = (s.value / total) * 100;
          return (
            <span
              key={s.label}
              className="seg"
              style={{
                flexGrow: s.value,
                background: colors[i % colors.length],
              }}
            >
              <span className="seg-tip">
                <strong>{s.label}</strong> · {formatUsd(s.value)} ·{" "}
                {pctLabel(pct)}
              </span>
            </span>
          );
        })}
      </div>
      <div className="stack-legend">
        {segments.map((s, i) => (
          <span key={s.label} className="legend-item">
            <span
              className="legend-dot"
              style={{ background: colors[i % colors.length] }}
              aria-hidden="true"
            />
            {s.label}{" "}
            <span className="legend-pct">
              {pctLabel((s.value / total) * 100)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function VersusChart({
  unstable,
  unstableTotal,
  stable,
  stableTotal,
}: {
  unstable: Segment[];
  unstableTotal: number;
  stable: Segment[];
  stableTotal: number;
}) {
  return (
    <div className="versus-chart">
      <StackBar
        title="Unstablecoins"
        total={unstableTotal}
        segments={unstable}
        colors={UNSTABLE_COLORS}
      />
      <StackBar
        title="Stablecoins"
        total={stableTotal}
        segments={stable}
        colors={STABLE_COLORS}
      />
    </div>
  );
}
