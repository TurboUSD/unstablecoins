import { getTokens } from "@/lib/market";

/** Ordered pair combinations, slug order = tokens.json order. */
export function comparePairs(): { slug: string; a: string; b: string }[] {
  const tokens = getTokens();
  const pairs: { slug: string; a: string; b: string }[] = [];
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      pairs.push({
        slug: `${tokens[i].id}-vs-${tokens[j].id}`,
        a: tokens[i].id,
        b: tokens[j].id,
      });
    }
  }
  return pairs;
}

/** Canonical slug for a pair regardless of argument order. */
export function comparePairSlug(x: string, y: string): string {
  const order = getTokens().map((t) => t.id);
  const [a, b] = [x, y].sort((m, n) => order.indexOf(m) - order.indexOf(n));
  return `${a}-vs-${b}`;
}
