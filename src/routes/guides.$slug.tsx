import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, Section, CardGrid, InfoCard } from "@/components/site/Sections";
import { GUIDES, guide } from "@/lib/site/guides";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const g = guide(params.slug);
    if (!g) throw notFound();
    return { guide: g };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Guide unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const g = loaderData.guide;
    return {
      meta: [
        { title: `${g.title} — WorkIQHub guides` },
        { name: "description", content: g.summary },
        { property: "og:title", content: `${g.title} — WorkIQHub guides` },
        { property: "og:description", content: g.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/guides/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: g.title,
            description: g.summary,
            articleSection: g.audience,
          }),
        },
      ],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide: g } = Route.useLoaderData();
  const related = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Guides", to: "/guides" }, { label: g.title }]} />

      <article className="py-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          {g.audience === "both" ? "Freelancers & clients" : `For ${g.audience}`} ·{" "}
          {g.readMinutes} min read
        </p>
        <h1 className="mt-5 max-w-[22ch] font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {g.title}
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg text-muted-foreground">{g.summary}</p>

        <nav aria-label="On this page" className="mt-10 rounded-2xl border border-border glass p-6">
          <h2 className="label-mono">On this page</h2>
          <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {g.sections.map((s) => (
              <li key={s.heading}>{s.heading}</li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 space-y-10">
          {g.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl uppercase tracking-tight">{s.heading}</h2>
              <div className="mt-4 max-w-[70ch] space-y-4 text-muted-foreground">
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.bullets && (
                  <ul className="list-disc space-y-1.5 pl-5">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
          <Link
            to="/get-started"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            {g.audience === "clients" ? "Post a project" : "Start freelancing"}
          </Link>
          <Link to="/tools" className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border">
            Try the free tools
          </Link>
        </div>
      </article>

      <Section title="Keep reading">
        <CardGrid cols={3}>
          {related.map((r) => (
            <InfoCard
              key={r.slug}
              meta={`${r.readMinutes} min read`}
              title={r.title}
              body={r.summary}
              to={`/guides/${r.slug}`}
            />
          ))}
        </CardGrid>
      </Section>
    </PageShell>
  );
}
