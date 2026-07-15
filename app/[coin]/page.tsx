import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChartEmbed from "@/components/ChartEmbed";
import { getTokens, getTokenRowById } from "@/lib/market";
import {
  formatUsd,
  formatPrice,
  formatNumber,
  formatDate,
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

  const jsonLd = [
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
          <a className="pill-link" href={t.website} target="_blank" rel="noopener">
            🌐 Official Website
          </a>
          <a className="pill-link" href={t.explorer} target="_blank" rel="noopener">
            🔍 Explorer
          </a>
          {t.twitter && (
            <a className="pill-link" href={t.twitter} target="_blank" rel="noopener">
              𝕏 Twitter
            </a>
          )}
          <a className="pill-link" href="/#rankings">
            📊 All Rankings
          </a>
        </div>

        <div className="contract-row">
          {t.address}{" "}
          <a href={t.explorer} target="_blank" rel="noopener">
            View on explorer ↗
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
          </div>
        </section>
      </div>
    </main>
  );
}
