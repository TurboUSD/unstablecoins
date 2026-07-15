import type { Metadata } from "next";
import { articleJsonLd, ArticleShell } from "../article";

export const metadata: Metadata = {
  title: "Stablecoin vs Unstablecoin: What's the Difference?",
  description:
    "Stablecoins are pegged to $1; unstablecoins have no peg at all. A side-by-side comparison of crypto's two opposite monetary designs: supply, backing, trust and purpose.",
  alternates: { canonical: "/learn/stablecoin-vs-unstablecoin" },
};

export default function Page() {
  return (
    <ArticleShell
      jsonLd={articleJsonLd({
        slug: "stablecoin-vs-unstablecoin",
        headline: "Stablecoin vs Unstablecoin: What's the Difference?",
        description:
          "A side-by-side comparison of crypto's two opposite monetary designs.",
      })}
      title="Stablecoin vs Unstablecoin"
    >
      <p>
        Stablecoins and unstablecoins sit at opposite ends of crypto&apos;s
        monetary spectrum. One promises your token will always be worth
        exactly one dollar; the other promises absolutely nothing and says so
        in the name. Here is how the two designs compare, property by
        property.
      </p>

      <table>
        <thead>
          <tr>
            <th scope="col">Property</th>
            <th scope="col">Stablecoin</th>
            <th scope="col">Unstablecoin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Price target</td>
            <td>$1, always</td>
            <td>None — free-floating</td>
          </tr>
          <tr>
            <td>Supply</td>
            <td>Elastic: mints with demand</td>
            <td>Fixed or deflationary</td>
          </tr>
          <tr>
            <td>Backing</td>
            <td>Reserves (cash, T-bills, collateral)</td>
            <td>Nothing — transparently</td>
          </tr>
          <tr>
            <td>Issuer</td>
            <td>Centralized company or protocol</td>
            <td>No issuer, community-driven</td>
          </tr>
          <tr>
            <td>Volatility</td>
            <td>A failure mode (depeg)</td>
            <td>The whole point</td>
          </tr>
          <tr>
            <td>Purpose</td>
            <td>Payments, trading, savings</td>
            <td>Satire, culture, speculation</td>
          </tr>
          <tr>
            <td>Honest about risk?</td>
            <td>&quot;Fully backed, trust us&quot;</td>
            <td>&quot;May go to zero&quot; — on the label</td>
          </tr>
        </tbody>
      </table>

      <h2>The philosophical split</h2>
      <p>
        The stablecoin argument: crypto needs a stable unit of account to be
        useful, and a tokenized dollar is the best bridge between traditional
        finance and blockchains. It works — stablecoins settle trillions in
        volume every year.
      </p>
      <p>
        The unstablecoin counter-argument: a &quot;stable&quot; dollar loses
        purchasing power every single year, so pegging to it just imports
        fiat debasement onchain, with a corporate middleman attached.
        Unstablecoins reject the peg entirely and choose a finite, volatile
        asset instead — closer in spirit to Bitcoin than to Tether, but
        wrapped in memes.
      </p>

      <h2>Which is &quot;better&quot;?</h2>
      <p>
        They aren&apos;t competitors in practice — a stablecoin is a tool, an
        unstablecoin is a statement (and a highly speculative one). If you
        need to park value or pay someone, you use a stablecoin. If you want
        to participate in a cultural experiment about what money is, that&apos;s
        what unstablecoins like <a href="/turbousd">TurboUSD</a> and{" "}
        <a href="/usduc">USDUC</a> exist for. Just remember only one of the
        two is designed to protect your downside — and it isn&apos;t the fun
        one.
      </p>
      <p>
        See all unstablecoins ranked by market cap in the{" "}
        <a href="/#rankings">live rankings</a>, or read the{" "}
        <a href="/learn/history-of-unstablecoins">history of unstablecoins</a>.
      </p>
    </ArticleShell>
  );
}
