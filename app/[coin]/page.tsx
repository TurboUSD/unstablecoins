import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChartEmbed from "@/components/ChartEmbed";
import ContractButton from "@/components/ContractButton";
import { getTokens, getTokenRowById } from "@/lib/market";
import { comparePairSlug } from "@/lib/compare";
import {
  formatUsd,
  formatPrice,
  formatNumber,
  formatDate,
  formatFullDate,
} from "@/lib/format";

export const revalidate = 300;
export const dynamicParams = false;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://unstablecoins.org";

export function generateStaticParams() {
  return getTokens().map((t) => ({ coin: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ coin: string }>;
}): Promise<Metadata> {
  const { coin } = await params;
  const t = getTokens().find((x) => x.id === coin);
  if (!t) return {};
  return {
    title: `${t.name} (${t.symbol}) Price, Market Cap & Chart`,
    description: `Live ${t.name} (${t.symbol}) price, market cap, supply, holders and chart. ${t.description[0]}`,
    alternates: { canonical: `/${t.id}` },
    openGraph: {
      title: `${t.name} (${t.symbol}) — Unstablecoin Price & Chart`,
      description: t.description[0],
      url: `${SITE_URL}/${t.id}`,
      type: "website",
    },
  };
}

export default async function CoinPage({
  params,
}: {
  params: Promise<{ coin: string }>;
}) {
  const { coin } = await params;
  const t = await getTokenRowById(coin);
  if (!t) notFound();

  const others = getTokens().filter((x) => x.id !== t.id);

  const faq = [
    {
      q: `What is ${t.name} (${t.symbol})?`,
      a: t.description[0],
    },
    {
      q: `Where can I buy ${t.symbol}?`,
      a: `${t.symbol} trades on ${t.dexLabel} on ${t.chainLabel}. Always verify the contract address before swapping — you can copy it from the button at the top of this page or check it on the block explorer.`,
    },
    {
      q: `What is ${t.symbol}'s contract address?`,
      a: `The official ${t.name} contract address on ${t.chainLabel} is ${t.address}.`,
    },
    {
      q: `Is ${t.name} a stablecoin?`,
      a: `No — quite the opposite. ${t.symbol} is an unstablecoin: it has no peg, no backing and no price target. Its value floats freely with the market, with volatility included by design.`,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Unstablecoins",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${t.name} (${t.symbol})`,
          item: `${SITE_URL}/${t.id}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${t.name} (${t.symbol}) Price, Market Cap & Chart`,
      url: `${SITE_URL}/${t.id}`,
      description: t.description[0],
      isPartOf: { "@type": "WebSite", name: "Unstablecoins", url: SITE_URL },
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Unstablecoins</a> <span aria-hidden="true">›</span>{" "}
          {t.name}
        </nav>

        <div className="coin-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.logo} alt={`${t.name} (${t.symbol}) logo`} width={56} height={56} />
          <h1>
            {t.name} <span className="ticker">{t.symbol}</span>{" "}
            <span className="chain-badge">{t.chainLabel}</span>
          </h1>
        </div>

        <div className="coin-price">
          <span className="big">{formatPrice(t.price)}</span>
          {t.priceChange24h !== null && (
            <span
              className={t.priceChange24h >= 0 ? "pct-up" : "pct-down"}
              style={{ fontSize: "1.1rem" }}
            >
              {t.priceChange24h >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(t.priceChange24h).toFixed(2)}% (24h)
            </span>
          )}
        </div>

        {t.id === "turbousd" && (
          <p className="launch-line">
            ⚡ The <strong>first unstablecoin ever deployed</strong> — launched
            on <strong>{formatFullDate(t.launchedOn)}</strong>
          </p>
        )}

        <div className="coin-links" style={{ margin: "0 0 22px" }}>
          <ContractButton address={t.address} chain={t.chain} />
          <a className="pill-link" href={t.website} target="_blank" rel="noopener">
            🌐 Website
          </a>
          {t.twitter && (
            <a className="pill-link" href={t.twitter} target="_blank" rel="noopener">
              𝕏 Twitter
            </a>
          )}
          {t.telegram && (
            <a className="pill-link" href={t.telegram} target="_blank" rel="noopener">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Telegram
            </a>
          )}
          <a className="pill-link" href={t.explorer} target="_blank" rel="noopener">
            🔍 Explorer
          </a>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="label">Market Cap</div>
            <div className="value">{formatUsd(t.marketCap)}</div>
          </div>
          <div className="stat-box">
            <div className="label">Supply</div>
            <div className="value">
              {formatNumber(t.supply)} {t.symbol}
            </div>
          </div>
          <div className="stat-box">
            <div className="label">Holders</div>
            <div className="value">{formatNumber(t.holders)}</div>
          </div>
          <div className="stat-box">
            <div className="label">Launched On</div>
            <div className="value">{formatDate(t.launchedOn)}</div>
          </div>
          <div className="stat-box">
            <div className="label">Chain</div>
            <div className="value">{t.chainLabel}</div>
          </div>
        </div>

        <ChartEmbed
          chain={t.dexChain}
          pair={t.pairAddress}
          title={`${t.name} (${t.symbol}) live price chart`}
        />

        <div className="coin-links">
          <a className="pill-link" href="/#rankings">
            📊 Back to Rankings
          </a>
        </div>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="prose">
            <h2>About {t.name}</h2>
            {t.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              Want to understand the category?{" "}
              <a href="/learn/what-is-an-unstablecoin">
                Read what an unstablecoin is
              </a>{" "}
              or compare it with its nemesis in{" "}
              <a href="/learn/stablecoin-vs-unstablecoin">
                stablecoin vs unstablecoin
              </a>
              .
            </p>

            <h2>{t.symbol} FAQ</h2>
          </div>
          <div className="faq-list" style={{ marginTop: 14 }}>
            {faq.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <div className="answer">
                  <p style={{ overflowWrap: "anywhere" }}>{f.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="coin-links" style={{ marginTop: 28 }}>
            {others.map((o) => (
              <a
                key={o.id}
                className="pill-link"
                href={`/compare/${comparePairSlug(t.id, o.id)}`}
              >
                ⚖️ {t.symbol} vs {o.symbol}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
