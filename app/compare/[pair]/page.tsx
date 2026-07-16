import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTokens, getTokenRowById, type TokenRow } from "@/lib/market";
import { comparePairs } from "@/lib/compare";
import {
  formatUsd,
  formatPrice,
  formatNumber,
  formatFullDate,
} from "@/lib/format";

export const revalidate = 300;
export const dynamicParams = false;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://unstablecoins.org";

export function generateStaticParams() {
  return comparePairs().map((p) => ({ pair: p.slug }));
}

function pairIds(pair: string): { a: string; b: string } | null {
  const found = comparePairs().find((p) => p.slug === pair);
  return found ? { a: found.a, b: found.b } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const ids = pairIds(pair);
  if (!ids) return {};
  const tokens = getTokens();
  const a = tokens.find((t) => t.id === ids.a)!;
  const b = tokens.find((t) => t.id === ids.b)!;
  return {
    title: `${a.symbol} vs ${b.symbol} — ${a.name} vs ${b.name} Comparison`,
    description: `Compare ${a.name} (${a.symbol}) and ${b.name} (${b.symbol}) side by side: live price, market cap, supply, holders, launch date and chain. Which unstablecoin is bigger?`,
    alternates: { canonical: `/compare/${pair}` },
  };
}

function Row({
  label,
  a,
  b,
}: {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
}) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>{a}</td>
      <td>{b}</td>
    </tr>
  );
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const ids = pairIds(pair);
  if (!ids) notFound();

  const [a, b] = await Promise.all([
    getTokenRowById(ids.a),
    getTokenRowById(ids.b),
  ]);
  if (!a || !b) notFound();

  const bigger: TokenRow = (a.marketCap ?? 0) >= (b.marketCap ?? 0) ? a : b;
  const smaller: TokenRow = bigger.id === a.id ? b : a;
  const ratio =
    smaller.marketCap && bigger.marketCap
      ? (bigger.marketCap / smaller.marketCap).toFixed(1)
      : null;
  const older: TokenRow = a.launchedOn <= b.launchedOn ? a : b;

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
          name: `${a.symbol} vs ${b.symbol}`,
          item: `${SITE_URL}/compare/${pair}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${a.name} vs ${b.name}`,
      url: `${SITE_URL}/compare/${pair}`,
      description: `Side-by-side comparison of the unstablecoins ${a.symbol} and ${b.symbol}.`,
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
          {a.symbol} vs {b.symbol}
        </nav>

        <article className="prose section" style={{ paddingTop: 8 }}>
          <h1>
            {a.name} vs {b.name}
          </h1>
          <p>
            {a.name} ({a.symbol}) and {b.name} ({b.symbol}) are two of the
            main unstablecoins — crypto assets that reject the stablecoin peg
            and embrace volatility by design. Here is how they compare on live
            market data.
          </p>

          <table>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">
                  <a href={`/${a.id}`}>
                    {a.name} ({a.symbol})
                  </a>
                </th>
                <th scope="col">
                  <a href={`/${b.id}`}>
                    {b.name} ({b.symbol})
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              <Row label="Price" a={formatPrice(a.price)} b={formatPrice(b.price)} />
              <Row
                label="Market Cap"
                a={<strong>{formatUsd(a.marketCap)}</strong>}
                b={<strong>{formatUsd(b.marketCap)}</strong>}
              />
              <Row
                label="Supply"
                a={formatNumber(a.supply)}
                b={formatNumber(b.supply)}
              />
              <Row
                label="Holders"
                a={formatNumber(a.holders)}
                b={formatNumber(b.holders)}
              />
              <Row
                label="Launched On"
                a={formatFullDate(a.launchedOn)}
                b={formatFullDate(b.launchedOn)}
              />
              <Row label="Chain" a={a.chainLabel} b={b.chainLabel} />
            </tbody>
          </table>

          <h2>The verdict</h2>
          <p>
            By market cap, <a href={`/${bigger.id}`}>{bigger.name}</a> is
            currently the larger of the two
            {ratio ? ` — about ${ratio}× the size of ${smaller.symbol}` : ""}.{" "}
            {older.name} has seniority: it launched on{" "}
            {formatFullDate(older.launchedOn)}
            {older.id === "turbousd"
              ? ", making it the first unstablecoin ever deployed"
              : ""}
            . Both have no peg, no backing and no promises — which is exactly
            the point.
          </p>
          <p>
            See where they rank against every other unstablecoin in the{" "}
            <a href="/#rankings">live rankings</a>, or read{" "}
            <a href="/learn/what-is-an-unstablecoin">
              what an unstablecoin is
            </a>
            .
          </p>
        </article>
      </div>
    </main>
  );
}
