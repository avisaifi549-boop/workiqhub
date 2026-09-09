import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, PageHero, Section, CardGrid, InfoCard } from "@/components/site/Sections";
import { GUIDES } from "@/lib/site/guides";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Loom" },
      {
        name: "description",
        content:
          "Notes on how the marketplace works and how freelance projects run. Until posts are published, our long-form guides cover the same ground.",
      },
      { property: "og:title", content: "Blog — Loom" },
      { property: "og:description", content: "Notes on freelancing, hiring and the marketplace." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Blog" }]} />
      <PageHero
        kicker="Blog"
        title="No posts published yet"
        lead="We would rather publish nothing than filler. Posts will appear here as they are written; in the meantime the guides below cover hiring, pricing, proposals and project management in depth."
      />

      <Section title="Read the guides instead">
        <CardGrid cols={3}>
          {GUIDES.slice(0, 6).map((g) => (
            <InfoCard
              key={g.slug}
              meta={`${g.readMinutes} min read`}
              title={g.title}
              body={g.summary}
              to={`/guides/${g.slug}`}
            />
          ))}
        </CardGrid>
        <Link
          to="/guides"
          className="mt-8 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          All guides
        </Link>
      </Section>
    </PageShell>
  );
}
