"use client";

import { useEffect, useState } from "react";

export default function ChartEmbed({
  chain,
  pair,
  title,
}: {
  chain: string;
  pair: string;
  title: string;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const el = document.documentElement;
    const update = () =>
      setTheme(el.dataset.theme === "light" ? "light" : "dark");
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  return (
    <iframe
      className="chart-embed"
      src={`https://dexscreener.com/${chain}/${pair}?embed=1&theme=${theme}&trades=0&info=0`}
      title={title}
      loading="lazy"
      allow="clipboard-write"
    />
  );
}
