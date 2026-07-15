import { ImageResponse } from "next/og";

export const alt =
  "Unstablecoins — Top Unstablecoins by Market Cap. Embrace the volatility.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0b0e14 0%, #141a28 60%, #1a1430 100%)",
          color: "#e8ebf1",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 34,
            color: "#ffb020",
            marginBottom: 28,
          }}
        >
          ⚡ THE UNSTABLECOIN LIST
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -3,
            display: "flex",
          }}
        >
          Unstablecoins
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#9aa4b8",
            marginTop: 24,
            display: "flex",
          }}
        >
          Prices · Market Caps · Rankings — no peg, no promises
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#6b7488",
            marginTop: 48,
            display: "flex",
          }}
        >
          unstablecoins.org — a project by TurboUSD
        </div>
      </div>
    ),
    { ...size }
  );
}
