const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://unstablecoins.org";

export function articleJsonLd({
  slug,
  headline,
  description,
}: {
  slug: string;
  headline: string;
  description: string;
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline,
      description,
      url: `${SITE_URL}/learn/${slug}`,
      author: { "@type": "Organization", name: "Unstablecoins" },
      publisher: {
        "@type": "Organization",
        name: "TurboUSD",
        url: "https://turbousd.com",
      },
      mainEntityOfPage: `${SITE_URL}/learn/${slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Unstablecoins",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Learn",
          item: `${SITE_URL}/learn`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: headline,
          item: `${SITE_URL}/learn/${slug}`,
        },
      ],
    },
  ];
}

export function ArticleShell({
  jsonLd,
  title,
  children,
}: {
  jsonLd: object;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Unstablecoins</a> <span aria-hidden="true">›</span>{" "}
          <a href="/learn">Learn</a> <span aria-hidden="true">›</span> {title}
        </nav>
        <article className="prose section" style={{ paddingTop: 8 }}>
          <h1>{title}</h1>
          {children}
        </article>
      </div>
    </main>
  );
}
