import tokensJson from "@/data/tokens.json";

export interface TokenStatic {
  id: string;
  name: string;
  symbol: string;
  chain: "solana" | "base" | "ethereum" | string;
  chainLabel: string;
  dexChain: string;
  address: string;
  pairAddress: string;
  website: string;
  explorer: string;
  twitter?: string;
  logo: string;
  launchedOn: string; // ISO date
  holdersFallback: number | null;
  supplyFallback: number | null;
  marketCapFallback: number | null;
  priceFallback: number | null;
  description: string[];
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

const RPC_URLS: Record<string, string | undefined> = {
  base: process.env.BASE_RPC_URL,
  ethereum: process.env.ETH_RPC_URL,
};

/**
 * Onchain fallback: ERC-20 totalSupply() via JSON-RPC (assumes 18 decimals
 * unless the token entry specifies otherwise). Only called when DexScreener
 * has no data for an EVM token.
 */
async function rpcTotalSupply(t: TokenStatic): Promise<number | null> {
  const rpc = RPC_URLS[t.chain];
  if (!rpc) return null;
  try {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [{ to: t.address, data: "0x18160ddd" }, "latest"],
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = await res.json();
    if (typeof j?.result !== "string" || !j.result.startsWith("0x"))
      return null;
    const decimals = BigInt((t as any).decimals ?? 18);
    const raw = BigInt(j.result);
    return Number(raw / 10n ** decimals);
  } catch {
    return null;
  }
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
  let supply =
    marketCap && price ? Math.round(marketCap / price) : null;
  if (supply === null) {
    // DexScreener unavailable: try reading totalSupply onchain (EVM only)
    supply = (await rpcTotalSupply(t)) ?? t.supplyFallback ?? null;
  }

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

export function getTokens(): TokenStatic[] {
  return TOKENS;
}

export async function getTokenRowById(id: string): Promise<TokenRow | null> {
  const t = TOKENS.find((x) => x.id === id);
  if (!t) return null;
  return getTokenRow(t);
}

export function totalMarketCap(rows: TokenRow[]): number {
  return rows.reduce((acc, r) => acc + (r.marketCap ?? 0), 0);
}

export interface StableItem {
  label: string;
  value: number;
}

export interface StablecoinBreakdown {
  total: number;
  items: StableItem[]; // top coins + "Others"
}

/**
 * USD-pegged stablecoin market caps from DefiLlama (cached 1h):
 * total + top coins breakdown for the comparison chart.
 */
export async function getStablecoinBreakdown(): Promise<StablecoinBreakdown | null> {
  const j = await fetchJson(
    "https://stablecoins.llama.fi/stablecoins?includePrices=false",
    3600
  );
  if (!Array.isArray(j?.peggedAssets)) return null;

  const usd = j.peggedAssets
    .filter((a: any) => a?.pegType === "peggedUSD")
    .map((a: any) => ({
      label: (a?.symbol || a?.name || "?") as string,
      value: (a?.circulating?.peggedUSD ?? 0) as number,
    }))
    .filter((a: StableItem) => a.value > 0)
    .sort((a: StableItem, b: StableItem) => b.value - a.value);

  if (!usd.length) return null;

  const total = usd.reduce((acc: number, a: StableItem) => acc + a.value, 0);
  const top = usd.slice(0, 5);
  const others = total - top.reduce((acc: number, a: StableItem) => acc + a.value, 0);
  const items = others > 0 ? [...top, { label: "Others", value: others }] : top;

  return { total, items };
}
