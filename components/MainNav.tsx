"use client";

import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/#rankings", label: "Rankings" },
  { href: "/learn", label: "Learn" },
  { href: "/#faq", label: "FAQ" },
  { href: "/submit", label: "Submit" },
  { href: "https://turbousd.com", label: "TurboUSD ⚡", external: true },
];

export default function MainNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="header-actions" aria-label="Main">
      <div
        id="main-menu"
        className={`nav-links${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
      >
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="nav-link"
            {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
          >
            {l.label}
          </a>
        ))}
      </div>
      <ThemeToggle />
      <button
        type="button"
        className="burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="main-menu"
        onClick={() => setOpen(!open)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
    </nav>
  );
}
