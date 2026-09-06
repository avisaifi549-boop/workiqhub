import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { EmptyState, CardSkeleton } from "@/components/site/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { profileStrength } from "@/lib/profile-strength";
import { getPlan, formatInr } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — Loom" },
      { name: "description", content: "Track your profile strength, jobs and applications." },
      { property: "og:title", content: "Your dashboard — Loom" },
      { property: "og:description", content: "Track your profile strength, jobs and applications." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user.id],
    queryFn: async () => {
      const [profileRes, freelancerRes, portfolioRes, applicationsRes, jobsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("freelancer_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("portfolio_items").select("id").eq("user_id", user.id),
        supabase
          .from("applications")
          .select("id, status, created_at, jobs(title, slug)")
          .eq("freelancer_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("jobs")
          .select("id, title, slug, status, created_at")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false }),
      ]);
      return {
        profile: profileRes.data,
        freelancer: freelancerRes.data,
        portfolioCount: portfolioRes.data?.length ?? 0,
        applications: applicationsRes.data ?? [],
        jobs: jobsRes.data ?? [],
      };
    },
  });

  if (isLoading || !data) {
    return (
      <PageShell>
        <div className="py-14">
          <CardSkeleton count={3} />
        </div>
      </PageShell>
    );
  }

  const isClient = data.profile?.account_type === "client";
  const strength = data.freelancer
    ? profileStrength({
        ...data.freelancer,
        avatar_url: data.profile?.avatar_url,
        portfolio_items: Array.from({ length: data.portfolioCount }),
      } as never)
    : { score: 0, recommendations: ["Create your freelancer profile to get discovered"] };
  const plan = getPlan((data.freelancer?.plan as never) ?? "free");

  return (
    <PageShell>
      <section className="py-12">
        <SectionLabel index="a">Dashboard</SectionLabel>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-tight">
          {data.profile?.full_name ?? "Welcome"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isClient ? "Your projects and applicants." : "Your profile, jobs and applications."}
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            {!isClient && (
              <div className="glass-strong rounded-2xl border border-border p-6">
                <p className="label-mono">Profile Strength</p>
                <p className="mt-2 font-display text-5xl text-primary">{strength.score}/100</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent/60">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {strength.recommendations.slice(0, 4).map((r) => (
                    <li key={r} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {r}
                    </li>
                  ))}
                  {strength.recommendations.length === 0 && <li>Your profile is complete.</li>}
                </ul>
                <Link
                  to="/profile"
                  className="mt-5 block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                >
                  Edit profile
                </Link>
              </div>
            )}

            <div className="glass rounded-2xl border border-border p-6">
              <p className="label-mono">Current plan</p>
              <p className="mt-2 font-display text-3xl">{plan.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {formatInr(plan.priceInr)}/month
              </p>
              <Link
                to="/pricing"
                className="mt-4 block rounded-lg glass px-4 py-2.5 text-center text-sm font-semibold ring-1 ring-border"
              >
                Compare plans
              </Link>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-8">
            {isClient ? (
              <div className="glass rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl uppercase tracking-tight">Your projects</h2>
                  <Link
                    to="/post-a-job"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Post a project
                  </Link>
                </div>
                {data.jobs.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">
                    You haven't posted a project yet. Post one and matching freelancers will apply.
                  </p>
                ) : (
                  <ul className="mt-5 divide-y divide-border">
                    {data.jobs.map((j) => (
                      <li key={j.id} className="flex items-center justify-between py-3">
                        <Link
                          to="/jobs/$slug"
                          params={{ slug: j.slug }}
                          className="font-medium hover:text-primary"
                        >
                          {j.title}
                        </Link>
                        <span className="font-mono text-xs capitalize text-muted-foreground">
                          {String(j.status).replace("_", " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="glass rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl uppercase tracking-tight">
                    Your applications
                  </h2>
                  <Link
                    to="/jobs"
                    search={{}}
                    className="rounded-lg glass px-4 py-2 text-sm font-semibold ring-1 ring-border"
                  >
                    Find work
                  </Link>
                </div>
                {data.applications.length === 0 ? (
                  <p className="mt-6 text-sm text-muted-foreground">
                    No applications yet. Browse the job board and apply — your proposal is drafted
                    from your real profile.
                  </p>
                ) : (
                  <ul className="mt-5 divide-y divide-border">
                    {data.applications.map((a) => (
                      <li key={a.id} className="flex items-center justify-between py-3">
                        <span className="font-medium">
                          {(a.jobs as { title?: string } | null)?.title ?? "Project"}
                        </span>
                        <span className="font-mono text-xs capitalize text-muted-foreground">
                          {String(a.status).replace("_", " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {!isClient && !data.freelancer && (
              <EmptyState
                title="Create your freelancer profile"
                description="Add your headline, skills, pricing and portfolio. Once it's strong enough it gets a public, search-indexable page."
                action={
                  <Link
                    to="/profile"
                    className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
                  >
                    Build my profile
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
