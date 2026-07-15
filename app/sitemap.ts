import type { MetadataRoute } from "next";
import tokens from "@/data/tokens.json";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://unstablecoins.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    ...tokens.map((t) => ({
      url: `${SITE_URL}/${t.id}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
    {
      url: `${SITE_URL}/learn`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/learn/what-is-an-unstablecoin`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/learn/stablecoin-vs-unstablecoin`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/learn/history-of-unstablecoins`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
