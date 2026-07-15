import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import MainNav from "@/components/MainNav";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://unstablecoins.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Unstablecoins — The Unstablecoin List | Live Prices, Charts & Rankings",
    template: "%s | Unstablecoins",
  },
  description:
    "The unstablecoin list. Live prices, market caps, supply and holders of every unstablecoin — USDUC, TurboUSD (₸USD), USDUT and more. Learn what an unstablecoin is.",
  keywords: [
    "unstablecoin",
    "unstablecoins",
    "unstable coin",
    "what is an unstablecoin",
    "unstablecoin list",
    "unstablecoin ranking",
    "unstablecoin market cap",
    "USDUC",
    "TurboUSD",
    "USDUT",
    "anti-stablecoin",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Unstablecoins",
    title: "Unstablecoins — The Unstablecoin List",
    description:
      "Live prices, market caps, charts and rankings of every unstablecoin. Embrace the volatility.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unstablecoins — The Unstablecoin List",
    description:
      "The unstablecoin list. Live prices, market caps, supply and holders of every unstablecoin.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e14" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInit = `(function(){try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;if(!s){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(e){if(!localStorage.getItem("theme")){document.documentElement.dataset.theme=e.matches?"dark":"light"}})}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
      </head>
      <body>
        <header className="site-header">
          <div className="container inner">
            <a href="/" className="brand" aria-label="Unstablecoins home">
              <span className="wordmark">unstablecoins</span>
              <span className="tld">.org</span>
            </a>
            <MainNav />
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <strong>unstablecoins.org</strong> — a project by{" "}
                <a
                  href="https://turbousd.com"
                  target="_blank"
                  rel="noopener"
                  title="TurboUSD · Embrace the Unstable"
                >
                  TurboUSD ⚡
                </a>
                <div style={{ marginTop: 6 }}>Embrace the Unstable.</div>
              </div>
              <div className="footer-links">
                <a href="/#rankings">Rankings</a>
                <a href="/learn/what-is-an-unstablecoin">
                  What is an unstablecoin?
                </a>
                <a href="/learn">Learn</a>
                <a href="/#faq">FAQ</a>
                <a href="/submit">Submit a coin</a>
                <a
                  href="https://turbousd.com"
                  target="_blank"
                  rel="noopener"
                >
                  TurboUSD
                </a>
                <a
                  href="https://x.com/turbousd"
                  target="_blank"
                  rel="noopener"
                >
                  X / Twitter
                </a>
              </div>
            </div>
            <p className="disclaimer">
              Unstablecoins are volatile by design. Nothing on this site is
              financial advice, an offer, or a solicitation to buy any token.
              Unstablecoins are cultural and satirical crypto assets with no
              peg, no guarantee of value, and a real possibility of going to
              zero. Market data is provided by DexScreener, Blockscout and
              Solscan and may be delayed or inaccurate. Always do your own
              research.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
