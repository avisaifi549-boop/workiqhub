import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, Section, CardGrid, InfoCard, CtaRow } from "@/components/site/Sections";
import { CATEGORY_GROUPS } from "@/lib/site/categories";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Freelance categories — browse talent by discipline | Loom" },
      {
        name: "description",
        content:
          "Browse Loom's freelance categories: AI and automation, development, design, marketing, writing, video, data, admin support and business. Find the specialists you need.",
      },
      { property: "og:title", content: "Freelance categories — Loom" },
      {
        property: "og:description",
        content: "Browse freelance talent by discipline across nine marketplace categories.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesIndex,
});

function CategoriesIndex() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Categories" }]} />
      <section className="py-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Categories</p>
        <h1 className="mt-5 max-w-[20ch] font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Browse talent by discipline
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg text-muted-foreground">
          Nine categories covering the work businesses hire freelancers for. Each one lists the
          skills inside it, the freelancers currently published, and the projects open right now.
        </p>
      </section>

      <Section title="All categories">
        <CardGrid>
          {CATEGORY_GROUPS.map((g) => (
            <InfoCard
              key={g.slug}
              meta={`${g.skills.length} skills`}
              title={g.name}
              body={g.description}
              to={`/categories/${g.slug}`}
            />
          ))}
        </CardGrid>
      </Section>

      <Section title="Not sure which fits?">
        <p className="max-w-[62ch] text-muted-foreground">
          Describe the outcome you need instead of the job title. Post a project and freelancers
          across every relevant category can apply, or search the whole marketplace at once.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/post-a-job"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Post a project
          </Link>
          <Link to="/search" className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border">
            Search the marketplace
          </Link>
        </div>
      </Section>

      <CtaRow
        primary={{ label: "Hire talent", to: "/freelancers" }}
        secondary={{ label: "Find work", to: "/jobs" }}
      />
    </PageShell>
  );
}
