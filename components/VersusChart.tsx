"use client";

import { useRef, useState } from "react";
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
  return `${pct.toFixed(4)}%`;
}

/* ---------- Horizontal stacked bars (composition) ---------- */

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

/* ---------- Proportional pies ---------- */

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function slicePath(
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number
): string {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

type TipHandler = (e: React.MouseEvent | null, text?: string) => void;

function Pie({
  segments,
  colors,
  size,
  cssSize,
  total,
  label,
  onTip,
}: {
  segments: Segment[];
  colors: string[];
  size: number;
  cssSize: string;
  total: number;
  label: string;
  onTip: TipHandler;
}) {
  const r = size / 2;
  let acc = 0;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={{ width: cssSize, height: "auto" }}
      className="pie"
      role="img"
      aria-label={`${label} market cap composition, total ${formatUsd(total)}`}
    >
      {segments.map((s, i) => {
        const a0 = (acc / total) * 360;
        acc += s.value;
        let a1 = (acc / total) * 360;
        if (a1 - a0 >= 360) a1 = a0 + 359.99;
        const pct = (s.value / total) * 100;
        const tipText = `${s.label} · ${formatUsd(s.value)} · ${pctLabel(pct)}`;
        return (
          <path
            key={s.label}
            d={slicePath(r, r, r - 1, a0, a1)}
            fill={colors[i % colors.length]}
            stroke="var(--surface)"
            strokeWidth={size / 150}
            onMouseMove={(e) => onTip(e, tipText)}
            onMouseLeave={() => onTip(null)}
          >
            <title>{tipText}</title>
          </path>
        );
      })}
    </svg>
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
  const ref = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(
    null
  );

  const sharePct = (unstableTotal / stableTotal) * 100;
  const growthX = Math.round(stableTotal / unstableTotal);

  const onTip: TipHandler = (e, text) => {
    if (!e || !text) {
      setTip(null);
      return;
    }
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    setTip({ x: e.clientX - box.left, y: e.clientY - box.top, text });
  };

  return (
    <div className="versus-chart">
      <div className="stack-bars">
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

      <div className="pies-wrap" ref={ref}>
        {tip && (
          <div
            className="pie-tip"
            style={{ left: tip.x + 14, top: tip.y - 34 }}
            role="status"
          >
            {tip.text}
          </div>
        )}
        <div className="pies">
          <div className="pie-col">
            <div className="pie-area">
              <Pie
                segments={unstable}
                colors={UNSTABLE_COLORS}
                size={100}
                cssSize="min(84px, 18vw)"
                total={unstableTotal}
                label="Unstablecoins"
                onTip={onTip}
              />
            </div>
            <div className="pie-label">
              <strong>Unstablecoins</strong>
              <span>{formatUsd(unstableTotal)}</span>
              <em>just {pctLabel(sharePct)} the size of stablecoins*</em>
            </div>
          </div>
          <div className="pie-col">
            <div className="pie-area">
              <Pie
                segments={stable}
                colors={STABLE_COLORS}
                size={300}
                cssSize="min(300px, 64vw)"
                total={stableTotal}
                label="Stablecoins"
                onTip={onTip}
              />
            </div>
            <div className="pie-label">
              <strong>Stablecoins</strong>
              <span>{formatUsd(stableTotal)}</span>
              <em>{growthX.toLocaleString("en-US")}× bigger</em>
            </div>
          </div>
        </div>
        <p className="pie-scale-note">
          *Not to scale — at true scale, the unstablecoin circle would be
          smaller than a single pixel.
        </p>
      </div>
    </div>
  );
}
