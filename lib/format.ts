export function formatUsd(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  if (n >= 1_000_000_000)
    return `$${(n / 1_000_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}B`;
  if (n >= 1_000_000)
    return `$${(n / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}M`;
  if (n >= 1_000)
    return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export function formatPrice(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  if (n >= 1) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  // small prices: keep 4 significant digits
  const str = n.toPrecision(4);
  return `$${parseFloat(str).toString()}`;
}

export function formatNumber(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  if (n >= 1_000_000_000)
    return `${(n / 1_000_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}B`;
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}M`;
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
