import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import { getJob } from "@/lib/public.functions";
import { formatInr } from "@/lib/plans";
import { useAuth } from "@/hooks/useAuth";

const jobQuery = (slug: string) =>
  queryOptions({ queryKey: ["job", slug], queryFn: () => getJob({ data: { slug } }) });

export const Route = createFileRoute("/jobs/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(jobQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Job unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const j = loaderData;
    const title = `${j.title} — freelance project | WorkIQHub`;
    const description = String(j.description).slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: j.title,
            description: j.description,
            datePosted: j.created_at,
            employmentType: "CONTRACTOR",
            skills: (j.skills ?? []).join(", "),
          }),
        },
      ],
    };
  },
  component: JobDetail,
});

function JobDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(jobQuery(slug));
  const { user } = useAuth();
  if (!data) throw notFound();
  const j = data;

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="pt-8">
        <ol className="flex gap-2 font-mono text-xs text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link to="/jobs" search={{}} className="hover:text-primary">
              Jobs
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="line-clamp-1 text-foreground">{j.title}</li>
        </ol>
      </nav>

      <section className="grid gap-8 py-10 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <span className="rounded-md bg-primary/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-primary">
            {String(j.status).replace("_", " ")}
          </span>
          <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-tight">
            {j.title}
          </h1>
          <div className="mt-6 glass rounded-2xl border border-border p-7">
            <h2 className="font-display text-2xl uppercase tracking-tight">Project brief</h2>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">{j.description}</p>
          </div>
          {j.skills?.length > 0 && (
            <div className="mt-6 glass rounded-2xl border border-border p-7">
              <h2 className="font-display text-2xl uppercase tracking-tight">Skills required</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {j.skills.map((s: string) => (
                  <span key={s} className="rounded-md bg-accent/50 px-2.5 py-1 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 glass-strong rounded-2xl border border-border p-6">
            <p className="label-mono">Budget</p>
            <p className="mt-1 font-display text-3xl">
              {formatInr(j.budget_min_inr)}
              {j.budget_max_inr ? ` – ${formatInr(j.budget_max_inr)}` : ""}
            </p>
            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Timeline</dt>
                <dd>{j.timeline_weeks ? `${j.timeline_weeks} weeks` : "Flexible"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Project type</dt>
                <dd className="capitalize">{String(j.project_type).replace("_", " ")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Experience</dt>
                <dd className="capitalize">{String(j.experience_level).replace("_", " ")}</dd>
              </div>
              {j.location && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd>{j.location}</dd>
                </div>
              )}
            </dl>
            {user ? (
              <Link
                to="/dashboard"
                className="mt-6 block rounded-lg bg-primary px-4 py-3 text-center font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
              >
                Apply from dashboard
              </Link>
            ) : (
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="mt-6 block rounded-lg bg-primary px-4 py-3 text-center font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
              >
                Sign up to apply
              </Link>
            )}
            <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
              Proposals are drafted from your real profile only
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
