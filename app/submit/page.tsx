import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Your Unstablecoin",
  description:
    "Get your unstablecoin listed on unstablecoins.org. Listing criteria and how to submit a token to the unstablecoin rankings.",
  alternates: { canonical: "/submit" },
};

export default function SubmitPage() {
  return (
    <main>
      <div className="container">
        <section className="section prose">
          <h1>Submit Your Unstablecoin</h1>
          <p>
            Building the next great monument to volatility? If your token is
            a real unstablecoin, we want it in the{" "}
            <a href="/#rankings">rankings</a>.
          </p>

          <h2>Listing criteria</h2>
          <p>
            To keep the list meaningful, a token must meet all of these
            conditions: it <strong>self-identifies as an unstablecoin</strong>{" "}
            (the anti-stablecoin narrative is core to the project, not an
            afterthought), it has <strong>no peg and no backing</strong>, it
            has <strong>live liquidity</strong> on a DEX tracked by
            DexScreener, and it has an <strong>official website</strong> and
            verifiable contract address.
          </p>

          <h2>How to submit</h2>
          <p>
            Reach out on X to{" "}
            <a href="https://x.com/turbousd" target="_blank" rel="noopener">
              @turbousd
            </a>{" "}
            with your token&apos;s name, ticker, chain, contract address,
            website and logo. If the repository is public on GitHub, you can
            also open a pull request adding your token to{" "}
            <code>data/tokens.json</code> — price, market cap, supply and
            holders are fetched automatically once listed.
          </p>

          <h2>What we don&apos;t list</h2>
          <p>
            Actual stablecoins (obviously), depegged stablecoins pretending
            it was on purpose, and tokens with no liquidity or abandoned
            websites. Dead unstablecoins may be removed from the rankings —
            the most unstable outcome of all.
          </p>
        </section>
      </div>
    </main>
  );
}
