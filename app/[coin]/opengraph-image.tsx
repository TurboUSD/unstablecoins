import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import tokensJson from "@/data/tokens.json";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Unstablecoin price and chart";

export default async function OgImage({
  params,
}: {
  params: Promise<{ coin: string }>;
}) {
  const { coin } = await params;
  const t = (tokensJson as any[]).find((x) => x.id === coin);

  // satori can't render non-latin glyphs like ₸ without downloading a
  // dynamic font, which may fail — fall back to an ASCII-safe label
  const symbolSafe =
    t && /^[\x20-\x7e]+$/.test(t.symbol)
      ? t.symbol
      : (t?.name?.split(" ")[0] ?? "");

  let logoSrc: string | null = null;
  if (t) {
    try {
      const buf = await readFile(path.join(process.cwd(), "public", t.logo));
      logoSrc = `data:image/png;base64,${buf.toString("base64")}`;
    } catch {}
  }

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
            gap: 18,
            fontSize: 30,
            color: "#ffb020",
            marginBottom: 36,
          }}
        >
          THE UNSTABLECOIN SCREENER ⚡
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {logoSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt=""
              width={140}
              height={140}
              style={{ borderRadius: 9999 }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: -2,
              }}
            >
              {t?.name ?? "Unstablecoin"}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 40,
                color: "#9aa4b8",
                marginTop: 6,
              }}
            >
              {`${symbolSafe} · ${t?.chainLabel ?? ""} · Price, Market Cap & Chart`}
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#6b7488",
            marginTop: 56,
            display: "flex",
          }}
        >
          unstablecoins.org — no peg, no promises
        </div>
      </div>
    ),
    { ...size }
  );
}
