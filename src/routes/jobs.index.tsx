import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { JobCard, type JobRow } from "@/components/site/JobCard";
import { EmptyState } from "@/components/site/EmptyState";
import { listJobs, listCategories } from "@/lib/public.functions";

const jobsQuery = (category?: string) =>
  queryOptions({
    queryKey: ["jobs", category ?? "all"],
    queryFn: async () => {
      const [jobs, categories] = await Promise.all([
        listJobs({ data: category ? { category } : {} }),
        listCategories(),
      ]);
      return { jobs, categories };
    },
  });

type Search = { category?: string };

export const Route = createFileRoute("/jobs/")({
  validateSearch: (s: Record<string, unknown>): Search =>
    typeof s["category"] === "string" ? { category: s["category"] } : {},
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(jobsQuery(deps.category)),
  head: () => ({
    meta: [
      { title: "Freelance jobs and projects — Loom job board" },
      {
        name: "description",
        content:
          "Browse open freelance projects with real budgets, timelines and required skills. Apply free and draft proposals from your own profile.",
      },
      { property: "og:title", content: "Freelance jobs and projects — Loom job board" },
      {
        property: "og:description",
        content: "Open freelance projects with real budgets, timelines and required skills.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const { category } = Route.useSearch();
  const { data } = useSuspenseQuery(jobsQuery(category));

  return (
    <PageShell>
      <section className="py-14">
        <SectionLabel index="a">Job board</SectionLabel>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-tight">Open projects</h1>
        <p className="mt-4 max-w-[52ch] text-muted-foreground">
          Real projects posted by real clients. Budgets, timelines and skills are shown up front.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to="/jobs"
            search={{}}
            className={
              !category
                ? "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                : "rounded-md glass px-3 py-1.5 text-sm ring-1 ring-border"
            }
          >
            All
          </Link>
          {data.categories.map((c) => (
            <Link
              key={c.id}
              to="/jobs"
              search={{ category: c.slug }}
              className={
                category === c.slug
                  ? "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                  : "rounded-md glass px-3 py-1.5 text-sm ring-1 ring-border"
              }
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {data.jobs.length === 0 ? (
            <div className="lg:col-span-2">
              <EmptyState
                title="No open jobs here yet"
                description="Nothing has been posted in this category. Post the first project, or browse all categories."
                action={
                  <Link
                    to="/post-a-job"
                    className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
                  >
                    Post a project
                  </Link>
                }
              />
            </div>
          ) : (
            data.jobs.map((j) => <JobCard key={j.id} job={j as unknown as JobRow} />)
          )}
        </div>
      </section>
    </PageShell>
  );
}
