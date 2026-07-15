import type { Metadata } from "next";
import { articleJsonLd, ArticleShell } from "../article";

export const metadata: Metadata = {
  title: "The History of Unstablecoins (2024–Today)",
  description:
    "From TurboUSD's October 2024 deployment on Base to the Solana unstablecoin wave of 2025 — how a satirical idea about money became a crypto category.",
  alternates: { canonical: "/learn/history-of-unstablecoins" },
};

export default function Page() {
  return (
    <ArticleShell
      jsonLd={articleJsonLd({
        slug: "history-of-unstablecoins",
        headline: "The History of Unstablecoins (2024–Today)",
        description:
          "How a satirical idea about money became a crypto category.",
      })}
      title="The History of Unstablecoins"
    >
      <p>
        The unstablecoin is a young category with a precise origin: it was
        born as a reaction to the stablecoin boom, at the exact moment
        tokenized dollars were becoming crypto&apos;s biggest success story.
        This is the timeline so far.
      </p>

      <h2>October 2024 — TurboUSD deploys the first unstablecoin</h2>
      <p>
        <a href="/turbousd">TurboUSD (₸USD)</a> launched on Base through the
        Mint.Club launchpad in October 2024, coining the category. The launch
        itself was part of the satire: ₸USD started at a fixed $1 price —
        simulating a stablecoin — with early buyers fully backed by
        withdrawable USDC, but with room for the price to float upward from
        there. The message: start where Tether stands, then embrace the
        chaos. In July 2025 the project relaunched in its final form as a
        Clanker token, which is the ₸USD contract that trades today.
      </p>

      <h2>May 2025 — USDUC brings the meme to Solana</h2>
      <p>
        <a href="/usduc">Unstable Coin (USDUC)</a> appeared on pump.fun in
        mid-2025 and did what Solana memecoins do best: distilled the idea
        into its purest, most viral form. No ecosystem, no thesis documents —
        just &quot;the coin that will never be worth $1&quot; and a community
        that loved it for exactly that. USDUC became the largest unstablecoin
        by market cap and made the term recognizable across crypto Twitter.
      </p>

      <h2>August 2025 — the parody wave</h2>
      <p>
        Success breeds imitation, and satire breeds meta-satire. In late
        August 2025 two parodies-of-the-parody launched on Solana within
        days of each other: <a href="/usdut">Unstable Tether (USDUT)</a>,
        mocking the world&apos;s largest stablecoin directly, and{" "}
        <a href="/unstable-states-dollar">Unstable States Dollar (USD)</a>,
        which skipped the middleman and parodied the US dollar itself —
        ticker included.
      </p>

      <h2>2025–2026 — from joke to ecosystem</h2>
      <p>
        While the Solana coins stayed pure meme, TurboUSD kept building:
        staking, an Artificial Monetary Intelligence (AMI) managing its
        onchain treasury like an autonomous central bank, physical products
        under the TurboX brand, and a growing cult identity around the motto
        &quot;Embrace the Unstable&quot;. The unstablecoin had evolved from a
        one-liner into a live experiment in alternative monetary design.
      </p>

      <h2>Where it goes next</h2>
      <p>
        Whether unstablecoins remain a niche satire or grow into a durable
        category, this site tracks every one of them — prices, market caps,
        supply and holders — in the <a href="/#rankings">live rankings</a>.
        New to the concept? Start with{" "}
        <a href="/learn/what-is-an-unstablecoin">what is an unstablecoin</a>.
      </p>
    </ArticleShell>
  );
}
