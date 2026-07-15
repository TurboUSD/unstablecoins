"use client";

import { useState } from "react";

function BaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 111 111" aria-hidden="true">
      <path
        fill="#0052FF"
        d="M54.9 111c30.4 0 55-24.9 55-55.5S85.3 0 54.9 0C26.1 0 2.4 22.2 0 50.4h72.7v10.1H0C2.4 88.8 26.1 111 54.9 111z"
      />
    </svg>
  );
}

function SolanaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 398 312" aria-hidden="true">
      <defs>
        <linearGradient id="solg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#9945FF" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <path
        fill="url(#solg)"
        d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm0-234.1C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8zm264.6 116.3c-2.4-2.4-5.7-3.8-9.2-3.8H2.6c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
      />
    </svg>
  );
}

export default function ContractButton({
  address,
  chain,
}: {
  address: string;
  chain: string;
}) {
  const [copied, setCopied] = useState(false);
  const short = `${address.slice(0, 6)}…${address.slice(-4)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <button
      type="button"
      className="pill-link contract-pill"
      onClick={copy}
      title={`Copy contract address: ${address}`}
      aria-label={`Copy contract address ${address}`}
    >
      {chain === "base" || chain === "ethereum" ? <BaseIcon /> : <SolanaIcon />}
      <span className="mono">{copied ? "Copied! ✓" : short}</span>
    </button>
  );
}
