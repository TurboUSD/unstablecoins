import tokensJson from "@/data/tokens.json";

export interface TokenStatic {
  id: string;
  name: string;
  symbol: string;
  chain: "solana" | "base" | "ethereum" | string;
  chainLabel: string;
  address: string;
  website: string;
  explorer: string;
  logo: string;
  launchedOn: string; // ISO date
  holdersFallback: number | null;
  supplyFallback: number | null;
  marketCapFallback: number | null;
  priceFallback: number | null;
}

export interface TokenRow extends TokenStatic {
  price: number | null;
  priceChange24h: number | null;
  marketCap: number | null;
  supply: number | null;
  holders: number | null;
  volume24h: number | null;
  live: boolean;
}

const TOKENS = tokensJson as TokenStatic[];

const UA =
  "Mozilla/5.0 (compatible; unstablecoins.org/1.0; +https://unstablecoins.org)";

async function fetchJson(
  url: string,
  revalidate: number,
  headers?: Record<string, string>
): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "application/json", ...headers },
      next: { revalidate },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Best (deepest-liquidity) DexScreener pair where our token is the base token. */
function bestPair(data: any, address: string): any | null {
  if (!data?.pairs?.length) return null;
  const mine = data.pairs.filter(
    (p: any) =>
      p?.baseToken?.address?.toLowerCase() === address.toLowerCase() &&
      p?.priceUsd
  );
  if (!mine.length) return null;
  mine.sort(
    (a: any, b: any) => (b?.liquidity?.usd ?? 0) - (a?.liquidity?.usd ?? 0)
  );
  return mine[0];
}

async function getHolders(t: TokenStatic): Promise<number | null> {
  if (t.chain === "base" || t.chain === "ethereum") {
    const host =
      t.chain === "base" ? "base.blockscout.com" : "eth.blockscout.com";
    const j = await fetchJson(
      `https://${host}/api/v2/tokens/${t.address}`,
      3600
    );
    const n = j?.holders_count ? parseInt(j.holders_count, 10) : NaN;
    if (Number.isFinite(n) && n > 0) return n;
  }
  if (t.chain === "solana") {
    const key = process.env.SOLSCAN_API_KEY;
    if (key) {
      const j = await fetchJson(
        `https://pro-api.solscan.io/v2.0/token/meta?address=${t.address}`,
        3600,
        { token: key }
      );
      const n = j?.data?.holder;
      if (Number.isFinite(n) && n > 0) return n;
    }
    const j = await fetchJson(
      `https://api-v2.solscan.io/v2/token/holder/total?address=${t.address}`,
      3600
    );
    const n = j?.data?.holders;
    if (Number.isFinite(n) && n > 0) return n;
  }
  return t.holdersFallback ?? null;
}

async function getTokenRow(t: TokenStatic): Promise<TokenRow> {
  const [dex, holders] = await Promise.all([
    fetchJson(
      `https://api.dexscreener.com/latest/dex/tokens/${t.address}`,
      300
    ),
    getHolders(t),
  ]);

  const pair = dex ? bestPair(dex, t.address) : null;

  const price = pair?.priceUsd ? parseFloat(pair.priceUsd) : t.priceFallback;
  const marketCap =
    pair?.marketCap ?? pair?.fdv ?? t.marketCapFallback ?? null;
  const supply =
    marketCap && price ? Math.round(marketCap / price) : t.supplyFallback;

  return {
    ...t,
    price: price ?? null,
    priceChange24h:
      typeof pair?.priceChange?.h24 === "number" ? pair.priceChange.h24 : null,
    marketCap,
    supply: supply ?? null,
    holders,
    volume24h: typeof pair?.volume?.h24 === "number" ? pair.volume.h24 : null,
    live: Boolean(pair),
  };
}

export async function getTokenRows(): Promise<TokenRow[]> {
  const rows = await Promise.all(TOKENS.map(getTokenRow));
  rows.sort((a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0));
  return rows;
}

export function totalMarketCap(rows: TokenRow[]): number {
  return rows.reduce((acc, r) => acc + (r.marketCap ?? 0), 0);
}
