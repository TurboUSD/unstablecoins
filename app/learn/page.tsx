import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn About Unstablecoins",
  description:
    "Guides and explainers about unstablecoins: what they are, how they differ from stablecoins, and the history of the unstablecoin movement.",
  alternates: { canonical: "/learn" },
};

const ARTICLES = [
  {
    href: "/learn/what-is-an-unstablecoin",
    title: "What Is an Unstablecoin?",
    blurb:
      "The complete guide to unstablecoins: definition, how they work, why they exist and what makes them the anti-stablecoin.",
  },
  {
    href: "/learn/stablecoin-vs-unstablecoin",
    title: "Stablecoin vs Unstablecoin",
    blurb:
      "Peg vs no peg, infinite supply vs fixed supply, trust vs chaos — a side-by-side comparison of crypto's two opposite monetary designs.",
  },
  {
    href: "/learn/history-of-unstablecoins",
    title: "The History of Unstablecoins",
    blurb:
      "From TurboUSD's October 2024 deployment to the Solana wave of 2025 — how a satirical idea became a crypto category.",
  },
];

export default function LearnPage() {
  return (
    <main>
      <div className="container">
        <section className="section">
          <h1
            style={{
              fontSize: "clamp(1.9rem, 5vw, 2.7rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              margin: "10px 0 8px",
            }}
          >
            Learn
          </h1>
          <p className="sub">
            Everything about unstablecoins, explained. New to the category?
            Start with the first article.
          </p>
          <div className="card-list">
            {ARTICLES.map((a) => (
              <a key={a.href} className="link-card" href={a.href}>
                <h3>{a.title}</h3>
                <p>{a.blurb}</p>
                <span className="cta">Read article →</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
