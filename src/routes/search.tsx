import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, Section } from "@/components/site/Sections";
import { EmptyState } from "@/components/site/EmptyState";
import { searchMarketplace } from "@/lib/public.functions";
import { formatInr } from "@/lib/plans";

type Search = { q?: string | undefined };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Search freelancers, services and jobs | WorkIQHub" },
      {
        name: "description",
        content:
          "Search the WorkIQHub marketplace across published freelancer profiles, services and open client projects. Results come from real listings only.",
      },
      { property: "og:title", content: "Search the WorkIQHub marketplace" },
      {
        property: "og:description",
        content: "One search across freelancers, services and open projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [term, setTerm] = useState(q ?? "");

  const { data, isFetching } = useQuery({
    queryKey: ["search", q ?? ""],
    queryFn: () => searchMarketplace({ data: { q: q ?? "" } }),
    enabled: Boolean(q && q.trim()),
  });

  const total =
    (data?.freelancers.length ?? 0) + (data?.services.length ?? 0) + (data?.jobs.length ?? 0);

  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Search" }]} />

      <section className="py-10">
        <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-tight">Search</h1>
        <p className="mt-4 max-w-[60ch] text-muted-foreground">
          One search across published freelancer profiles, services and open client projects.
        </p>
        <form
          role="search"
          className="mt-7 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ search: { q: term.trim() || undefined } });
          }}
        >
          <label className="sr-only" htmlFor="site-search">
            Search the marketplace
          </label>
          <input
            id="site-search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Skill, role or project — e.g. React, SEO audit, video editing"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Search
          </button>
        </form>
      </section>

      {!q?.trim() ? (
        <Section title="Start with a skill">
          <p className="max-w-[60ch] text-muted-foreground">
            Type what you need above, or browse{" "}
            <Link to="/categories" className="text-primary underline-offset-4 hover:underline">
              all categories
            </Link>
            .
          </p>
        </Section>
      ) : isFetching && !data ? (
        <p className="py-10 font-mono text-sm text-muted-foreground">Searching…</p>
      ) : total === 0 ? (
        <EmptyState
          title={`Nothing matches "${q}" yet`}
          description="We only return real published listings, so a new marketplace shows fewer results. Try a broader term, or post a project and let freelancers come to you."
          action={
            <Link
              to="/post-a-job"
              className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
            >
              Post a project
            </Link>
          }
        />
      ) : (
        <>
          <p className="font-mono text-xs text-muted-foreground">
            {total} {total === 1 ? "result" : "results"} for “{q}”
          </p>

          {(data?.freelancers.length ?? 0) > 0 && (
            <Section title="Freelancers">
              <div className="grid gap-4 sm:grid-cols-2">
                {data!.freelancers.map((f) => (
                  <Link
                    key={f.user_id}
                    to="/freelancer/$slug"
                    params={{ slug: f.slug }}
                    className="glass rounded-2xl border border-border p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
                  >
                    <p className="label-mono">Freelancer</p>
                    <h3 className="mt-2 font-semibold tracking-tight">
                      {f.profiles?.full_name ?? "Freelancer"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{f.headline}</p>
                    {f.starting_price_inr && (
                      <p className="mt-3 font-mono text-xs text-primary">
                        From {formatInr(f.starting_price_inr)}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {(data?.services.length ?? 0) > 0 && (
            <Section title="Services">
              <div className="grid gap-4 sm:grid-cols-2">
                {data!.services.map((s) => (
                  <div key={s.id} className="glass rounded-2xl border border-border p-5">
                    <p className="label-mono">Service</p>
                    <h3 className="mt-2 font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {s.description}
                    </p>
                    <p className="mt-3 font-mono text-xs text-muted-foreground">
                      {s.starting_price_inr ? `From ${formatInr(s.starting_price_inr)}` : "Custom quote"}
                      {s.delivery_days ? ` · ${s.delivery_days} day delivery` : ""}
                    </p>
                    {s.freelancer_profiles?.slug && (
                      <Link
                        to="/freelancer/$slug"
                        params={{ slug: s.freelancer_profiles.slug }}
                        className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
                      >
                        View freelancer
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {(data?.jobs.length ?? 0) > 0 && (
            <Section title="Open projects">
              <div className="grid gap-4 sm:grid-cols-2">
                {data!.jobs.map((j) => (
                  <Link
                    key={j.id}
                    to="/jobs/$slug"
                    params={{ slug: j.slug }}
                    className="glass rounded-2xl border border-border p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
                  >
                    <p className="label-mono">Project</p>
                    <h3 className="mt-2 font-semibold tracking-tight">{j.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {j.description}
                    </p>
                    {j.budget_min_inr && j.budget_max_inr && (
                      <p className="mt-3 font-mono text-xs text-primary">
                        {formatInr(j.budget_min_inr)} – {formatInr(j.budget_max_inr)}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </Section>
          )}
        </>
      )}
    </PageShell>
  );
}
