import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, Section, CardGrid, InfoCard, CtaRow } from "@/components/site/Sections";
import { JobCard, type JobRow } from "@/components/site/JobCard";
import { EmptyState } from "@/components/site/EmptyState";
import { listJobsIn } from "@/lib/public.functions";
import { CATEGORY_GROUPS, categoryGroup, relatedGroups } from "@/lib/site/categories";

const jobsQuery = (slug: string) =>
  queryOptions({
    queryKey: ["jobs-category", slug],
    queryFn: async () => {
      const group = categoryGroup(slug);
      if (!group) return { group: null, jobs: [] };
      const jobs = await listJobsIn({
        data: { categories: group.dbCategories, limit: 40 },
      }).catch(() => []);
      return { group, jobs };
    },
  });

export const Route = createFileRoute("/jobs/c/$category")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(jobsQuery(params.category));
    if (!data.group) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const group = loaderData?.group;
    if (!group) {
      return { meta: [{ title: "Category unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${group.short} jobs — freelance projects hiring now | WorkIQHub`;
    const description = `Browse open freelance ${group.short.toLowerCase()} projects on WorkIQHub. Real client briefs with stated budgets, timelines and milestone-based payment.`;
    const empty = (loaderData?.jobs.length ?? 0) === 0;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(empty ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      links: [{ rel: "canonical", href: `/jobs/c/${params.category}` }],
    };
  },
  component: JobCategoryPage,
});

function JobCategoryPage() {
  const { category } = Route.useParams();
  const { data } = useSuspenseQuery(jobsQuery(category));
  const group = data.group ?? CATEGORY_GROUPS[0]!;
  const related = relatedGroups(group.slug);

  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Jobs", to: "/jobs" }, { label: group.short }]} />

      <section className="py-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Find work</p>
        <h1 className="mt-5 max-w-[20ch] font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
          {group.short} jobs
        </h1>
        <p className="mt-5 max-w-[64ch] text-lg text-muted-foreground">
          Open projects posted by clients hiring for {group.short.toLowerCase()} work. Every listing
          is a real brief — we do not seed the board with sample jobs.
        </p>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          {data.jobs.length} open {data.jobs.length === 1 ? "project" : "projects"}
        </p>
      </section>

      <section className="pb-4">
        {data.jobs.length === 0 ? (
          <EmptyState
            title="No open projects in this category right now"
            description="New briefs appear here the moment a client publishes one. Create your profile so you are ready to apply — and get notified when a match goes live."
            action={
              <Link
                to="/get-started"
                className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
              >
                Create your profile
              </Link>
            }
          />
        ) : (
          <div className="space-y-5">
            {data.jobs.map((j) => (
              <JobCard key={j.id} job={j as unknown as JobRow} />
            ))}
          </div>
        )}
      </section>

      <Section title="Skills clients hire for here">
        <ul className="flex flex-wrap gap-2">
          {group.skills.map((s) => (
            <li
              key={s}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
            >
              {s}
            </li>
          ))}
        </ul>
      </Section>

      {related.length > 0 && (
        <Section title="Other job categories">
          <CardGrid>
            {related.map((r) => (
              <InfoCard
                key={r.slug}
                title={`${r.short} jobs`}
                body={r.short}
                to={`/jobs/c/${r.slug}`}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      <CtaRow
        primary={{ label: "Create your profile", to: "/get-started" }}
        secondary={{ label: "All open jobs", to: "/jobs" }}
      />
    </PageShell>
  );
}
