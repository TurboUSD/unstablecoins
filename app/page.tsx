import UnstableTable from "@/components/UnstableTable";
import { getTokenRows, totalMarketCap } from "@/lib/market";
import { formatUsd, formatNumber } from "@/lib/format";

export const revalidate = 300;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://unstablecoins.org";

const FAQ: { q: string; a: string[] }[] = [
  {
    q: "What is an unstablecoin?",
    a: [
      "An unstablecoin is a cryptocurrency that deliberately does the opposite of a stablecoin. Where stablecoins like USDT or USDC are pegged to the US dollar and engineered to always be worth $1, an unstablecoin has no peg at all: its price floats freely with the market and it openly embraces volatility.",
      "Most unstablecoins are satirical or cultural tokens. They parody the language of \"stability\" used by fiat currencies and stablecoin issuers, arguing that a dollar that constantly loses purchasing power to inflation is not really stable either. Instead of hiding volatility, unstablecoins make it the whole point.",
    ],
  },
  {
    q: "How is an unstablecoin different from a stablecoin?",
    a: [
      "A stablecoin is designed to hold a fixed value (usually $1) through reserves, collateral or algorithms, and its supply typically expands as demand grows. An unstablecoin flips every one of those properties: no peg, no price target, and usually a fixed or deflationary supply.",
      "In short: a stablecoin promises your token will always be worth the same; an unstablecoin promises absolutely nothing — and says so up front.",
    ],
  },
  {
    q: "Why do unstablecoins exist?",
    a: [
      "Unstablecoins emerged alongside the stablecoin boom as a counter-narrative — the first one, TurboUSD, deployed in October 2024, and the wave went mainstream in 2025. As digital dollars became one of crypto's biggest sectors, some communities argued that stablecoins simply reproduce fiat logic onchain: centralized trust and slow monetary debasement dressed up as \"stability\".",
      "Unstablecoins respond with satire and alternative monetary design — fixed supplies, deflationary mechanics and no central promise-keeper. Projects like TurboUSD (₸USD) frame this as a live experiment: a finite, openly volatile asset instead of an infinite, quietly inflating one.",
    ],
  },
  {
    q: "Which unstablecoins exist today?",
    a: [
      "The main unstablecoins tracked on this site are Unstable Coin (USDUC) on Solana, TurboUSD Unstablecoin (₸USD) on Base, Unstable Tether (USDUT) on Solana, and Unstable States Dollar (USD) on Solana. The ranking above lists them by market capitalization with live prices, supply and holder counts.",
    ],
  },
  {
    q: "Do unstablecoins have a peg or backing?",
    a: [
      "No. Unstablecoins are not backed by dollars, treasuries or any reserve, and they do not target any price. Their value comes entirely from market demand, community, culture and, in some cases, ecosystem mechanics like deflationary supply or treasuries — for example TurboUSD's onchain treasury managed by an AI agent.",
    ],
  },
  {
    q: "Are unstablecoins a good investment?",
    a: [
      "Unstablecoins are extremely high-risk, volatile assets — that volatility is literally their design goal. Most describe themselves as entertainment, satire or cultural experiments with no intrinsic value and no expectation of profit. Never put in money you cannot afford to lose, and always do your own research. Nothing on this site is financial advice.",
    ],
  },
  {
    q: "How do I buy an unstablecoin?",
    a: [
      "Unstablecoins trade on decentralized exchanges on their native chains: USDUC, USDUT and USD trade on Solana DEXs like PumpSwap, Raydium and Meteora, while TurboUSD (₸USD) trades on Uniswap on Base. Click any coin in the table above to visit its official website for contract addresses and buying instructions — and always verify the contract address before swapping.",
    ],
  },
  {
    q: "What was the first unstablecoin?",
    a: [
      "TurboUSD (₸USD) was the first unstablecoin ever deployed. It originally launched on Base through the Mint.Club launchpad in October 2024 — starting at $1 to simulate a stablecoin, but with room to grow — and later relaunched in its current form as a Clanker token in July 2025.",
      "The wave went mainstream in 2025: Unstable Coin (USDUC) popularized the concept on Solana in mid-2025, followed by parodies like Unstable Tether (USDUT) and Unstable States Dollar (USD). TurboUSD remains the only one to build a full ecosystem around the idea — fixed supply, staking, an AI-run treasury and a real-world brand.",
    ],
  },
];

export default async function Home() {
  const rows = await getTokenRows();
  const mcap = totalMarketCap(rows);
  const holders = rows.reduce((a, r) => a + (r.holders ?? 0), 0);
  const updatedAt =
    new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " UTC";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Unstablecoins",
      alternateName: "The Unstablecoin List",
      url: SITE_URL,
      description:
        "Live prices, market caps and rankings of every unstablecoin.",
      publisher: {
        "@type": "Organization",
        name: "TurboUSD",
        url: "https://turbousd.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Top Unstablecoins by Market Cap",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: rows.length,
      itemListElement: rows.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${t.name} (${t.symbol})`,
        url: t.website,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") },
      })),
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="hero">
        <div className="container">
          <span className="eyebrow">⚡ Embrace the Unstable</span>
          <h1>
            The <span className="grad">Unstablecoin</span> List
          </h1>
          <p className="lede">
            An <strong>unstablecoin</strong> is the opposite of a stablecoin: a
            crypto asset with no peg, no promises and no fear of volatility.
            Track every unstablecoin&apos;s live price, market cap, supply and
            holders — all in one place.
          </p>
          <div className="stats" role="list">
            <span className="stat-chip" role="listitem">
              Unstablecoins tracked<strong>{rows.length}</strong>
            </span>
            <span className="stat-chip" role="listitem">
              Combined market cap<strong>{formatUsd(mcap)}</strong>
            </span>
            <span className="stat-chip" role="listitem">
              Combined holders<strong>{formatNumber(holders)}</strong>
            </span>
          </div>
        </div>
      </section>

      <section className="table-section" id="rankings" aria-label="Unstablecoin rankings">
        <div className="container">
          <UnstableTable rows={rows} updatedAt={updatedAt} />
        </div>
      </section>

      <section className="section" id="what-is-an-unstablecoin">
        <div className="container">
          <h2>What is an unstablecoin?</h2>
          <p className="sub">
            Stablecoins promise your token will always be worth $1.
            Unstablecoins promise nothing — on purpose. Born alongside the
            stablecoin boom, they reject the illusion of stability sold by
            fiat currencies and pegged tokens, and embrace free-floating value
            instead.
          </p>
          <div className="about-grid">
            <div className="about-card">
              <span className="emoji" aria-hidden="true">
                📉📈
              </span>
              <h3>No peg, by design</h3>
              <p>
                An unstablecoin never targets $1 — or any price. Its value
                floats freely with the market, making volatility a feature,
                not a bug.
              </p>
            </div>
            <div className="about-card">
              <span className="emoji" aria-hidden="true">
                🔒
              </span>
              <h3>Fixed or deflationary supply</h3>
              <p>
                While stablecoins print more tokens as demand grows, most
                unstablecoins have a hard-capped or shrinking supply — the
                anti-debasement stance.
              </p>
            </div>
            <div className="about-card">
              <span className="emoji" aria-hidden="true">
                🎭
              </span>
              <h3>Satire with a thesis</h3>
              <p>
                Unstablecoins parody the language of &quot;stability&quot;: if
                the dollar loses purchasing power every year, was it ever
                really stable?
              </p>
            </div>
            <div className="about-card">
              <span className="emoji" aria-hidden="true">
                ⚡
              </span>
              <h3>Culture and ecosystems</h3>
              <p>
                From memes to real-world brands and AI-managed treasuries,
                unstablecoins turn a joke about money into living onchain
                experiments.
              </p>
            </div>
            <div className="about-card">
              <span className="emoji" aria-hidden="true">
                🏦
              </span>
              <h3>No issuer, no redemption desk</h3>
              <p>
                Stablecoins depend on a company holding reserves that can be
                frozen or mismanaged. Unstablecoins have no central issuer —
                there is nothing to trust and nothing to redeem.
              </p>
            </div>
            <div className="about-card">
              <span className="emoji" aria-hidden="true">
                🎢
              </span>
              <h3>High risk, zero promises</h3>
              <p>
                Unstablecoins are speculative cultural assets that can go to
                zero — and they say so on the label. Arguably the most honest
                disclaimer in crypto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <h2>Unstablecoin FAQ</h2>
          <p className="sub">
            Everything you need to know about unstablecoins — what they are,
            why they exist and how they differ from stablecoins.
          </p>
          <div className="faq-list">
            {FAQ.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <div className="answer">
                  {f.a.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
