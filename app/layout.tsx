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
      "Unstablecoins — The Unstablecoin Screener | Live Prices, Charts & Rankings",
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
    title: "Unstablecoins — The Unstablecoin Screener",
    description:
      "Live prices, market caps, charts and rankings of every unstablecoin. Embrace the volatility.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unstablecoins — The Unstablecoin Screener",
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
              <span className="dot">.</span>
              <span className="tld">org</span>
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
                  TurboUSD Unstablecoin
                </a>
                <div style={{ marginTop: 6 }}>Embrace the Unstable ⚡</div>
              </div>
              <div className="footer-right">
                <div className="footer-links">
                  <a href="/#rankings">Rankings</a>
                  <a href="/learn/what-is-an-unstablecoin">
                    What is an unstablecoin?
                  </a>
                  <a href="/learn">Learn</a>
                  <a href="/#faq">FAQ</a>
                  <a href="/submit">Submit a coin</a>
                </div>
                <div className="footer-social">
                  <a
                    className="social-icon"
                    href="https://x.com/turbousd"
                    target="_blank"
                    rel="noopener"
                    aria-label="X / Twitter"
                    title="X / Twitter"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                    </svg>
                  </a>
                  <a
                    className="social-icon"
                    href="https://t.me/turbo_usd"
                    target="_blank"
                    rel="noopener"
                    aria-label="Telegram"
                    title="Telegram"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </a>
                </div>
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
