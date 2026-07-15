# unstablecoins.org

The unstablecoin list. Live prices, market caps, supply and holders of every unstablecoin, plus an SEO-optimized explainer of what an unstablecoin is. A project by [TurboUSD](https://turbousd.com).

## Stack

Next.js (App Router) + TypeScript, no UI libraries. Server-rendered with ISR (data revalidates every 5 minutes) for SEO. Deployed on Vercel.

## Data sources

- **Price / market cap / 24h change**: [DexScreener API](https://docs.dexscreener.com) (no key required). Deepest-liquidity pair per token.
- **Holders (Base/Ethereum)**: Blockscout public API (no key required).
- **Holders (Solana)**: Solscan public endpoint; uses `SOLSCAN_API_KEY` (Solscan Pro) if set. Falls back to static values in `data/tokens.json`.
- **Supply**: computed as market cap / price, with static fallback.

If every API fails, the site still renders using the fallback values in `data/tokens.json`.

## Adding or editing a coin

Edit `data/tokens.json`. Each entry needs name, symbol, chain (`solana` | `base` | `ethereum`), contract address, official website, explorer URL, logo path (drop a PNG in `public/logos/`), launch date and fallback values. Ranking, prices and totals update automatically.

## SEO

- Server-rendered HTML with ISR, semantic markup and full metadata (Open Graph, Twitter cards, canonical).
- JSON-LD structured data: `WebSite`, `ItemList` (rankings) and `FAQPage`.
- `sitemap.xml` and `robots.txt` generated from `NEXT_PUBLIC_SITE_URL`.
- Dynamic Open Graph image at `/opengraph-image`.
