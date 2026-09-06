import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccount, fetchContracts } from "@/lib/account";
import { supabase } from "@/integrations/supabase/client";
import { DashShell, StatCard } from "@/components/dash/DashShell";
import { CardSkeleton, EmptyState } from "@/components/site/EmptyState";
import { profileStrength } from "@/lib/profile-strength";
import { matchScore } from "@/lib/match";
import { averageRating } from "@/lib/marketplace";
import { formatInr } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Loom" },
      { name: "description", content: "Your Loom marketplace dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => fetchAccount(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (account && !account.profile?.onboarding_complete) {
      void navigate({ to: "/onboarding", replace: true });
    }
  }, [account, navigate]);

  const role = account?.role ?? "freelancer";

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.id, role],
    queryFn: async () => {
      const contracts = await fetchContracts(user!.id);
      const reviews =
        (await supabase.from("reviews").select("rating").eq("reviewee_id", user!.id).eq("is_hidden", false))
          .data ?? [];

      if (role === "client") {
        const jobs =
          (await supabase.from("jobs").select("id, title, slug, status").eq("client_id", user!.id)).data ??
          [];
        const ids = jobs.map((j) => j.id);
        const applications = ids.length
          ? ((await supabase.from("applications").select("id, status, job_id").in("job_id", ids)).data ?? [])
          : [];
        const talent =
          (
            await supabase
              .from("freelancer_profiles")
              .select("user_id, slug, headline, skills, hourly_rate_inr, profiles(full_name)")
              .eq("is_published", true)
              .limit(6)
          ).data ?? [];
        return { contracts, reviews, jobs, applications, talent, matched: [] as MatchedJob[] };
      }

      const applications =
        (await supabase.from("applications").select("id, status, job_id").eq("freelancer_id", user!.id))
          .data ?? [];
      const jobs =
        (
          await supabase
            .from("jobs")
            .select("id, title, slug, description, skills, budget_min_inr, budget_max_inr, timeline_weeks, status")
            .eq("status", "published")
            .order("created_at", { ascending: false })
            .limit(20)
        ).data ?? [];

      const skills = account?.freelancer?.skills ?? [];
      const matched: MatchedJob[] = jobs
        .filter((j) => !applications.some((a) => a.job_id === j.id))
        .map((j) => ({
          job: j,
          ...matchScore({
            jobSkills: j.skills ?? [],
            jobBudgetMin: j.budget_min_inr,
            jobBudgetMax: j.budget_max_inr,
            freelancerSkills: skills,
            freelancerStartingPrice: account?.freelancer?.starting_price_inr ?? null,
            portfolioCount: account?.portfolioCount ?? 0,
            yearsExperience: account?.freelancer?.years_experience ?? 0,
          }),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      return { contracts, reviews, jobs, applications, talent: [], matched };
    },
    enabled: !!user && !!account,
  });

  if (accountLoading || isLoading || !account || !data) {
    return (
      <DashShell role={role} title="Dashboard">
        <CardSkeleton count={4} />
      </DashShell>
    );
  }

  const rating = averageRating(data.reviews);
  const activeContracts = data.contracts.filter(
    (c) => !["completed", "cancelled"].includes(c.status),
  );
  const completed = data.contracts.filter((c) => c.status === "completed");
  const earnings = completed
    .filter((c) => c.freelancer_id === user?.id)
    .reduce((sum, c) => sum + Number(c.amount_inr ?? 0), 0);

  if (role === "client") {
    return (
      <DashShell
        role="client"
        title={`Welcome, ${account.profile?.full_name?.split(" ")[0] ?? "there"}`}
        subtitle="Your hiring pipeline at a glance."
        actions={
          <Link
            to="/post-a-job"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Post a project
          </Link>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Jobs posted" value={data.jobs.length} />
          <StatCard label="Applications" value={data.applications.length} />
          <StatCard label="Active projects" value={activeContracts.length} />
          <StatCard label="Completed" value={completed.length} />
        </div>

        <h2 className="mt-10 font-display text-2xl uppercase tracking-tight">Recommended talent</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.talent.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                title="No published freelancers yet"
                description="As freelancers publish their profiles, your best matches will appear here."
              />
            </div>
          ) : (
            data.talent.map((t) => (
              <article key={t.user_id} className="glass rounded-2xl border border-border p-5">
                <p className="font-semibold">
                  <Link to="/freelancer/$slug" params={{ slug: t.slug }} className="hover:text-primary">
                    {(t.profiles as { full_name: string } | null)?.full_name ?? "Freelancer"}
                  </Link>
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.headline}</p>
                {t.hourly_rate_inr && (
                  <p className="mt-3 font-mono text-xs text-primary">
                    {formatInr(t.hourly_rate_inr)}/hr
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </DashShell>
    );
  }

  const strength = profileStrength({
    ...account.freelancer,
    avatar_url: account.profile?.avatar_url,
    portfolioCount: account.portfolioCount,
  });

  return (
    <DashShell
      role="freelancer"
      title={`Welcome, ${account.profile?.full_name?.split(" ")[0] ?? "there"}`}
      subtitle="Your work, applications and matches."
      actions={
        <Link
          to="/jobs"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Find jobs
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Profile strength" value={`${strength.score}%`} hint={strength.recommendations[0]} />
        <StatCard label="Applications" value={data.applications.length} />
        <StatCard label="Active projects" value={activeContracts.length} />
        <StatCard
          label="Earnings released"
          value={formatInr(earnings)}
          hint={rating ? `${rating}★ from ${data.reviews.length} reviews` : "No reviews yet"}
        />
      </div>

      <h2 className="mt-10 font-display text-2xl uppercase tracking-tight">Recommended jobs</h2>
      <div className="mt-4 space-y-4">
        {data.matched.length === 0 ? (
          <EmptyState
            title="No matches yet"
            description="Add more skills to your profile — we match jobs against your real skills, portfolio and rate."
            action={
              <Link
                to="/profile"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Update profile
              </Link>
            }
          />
        ) : (
          data.matched.map(({ job, score, matching, missing }) => (
            <article key={job.id} className="glass rounded-2xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  <Link to="/jobs/$slug" params={{ slug: job.slug }} className="hover:text-primary">
                    {job.title}
                  </Link>
                </h3>
                <span className="rounded-md bg-primary/15 px-2.5 py-1 font-mono text-[11px] uppercase text-primary">
                  Match {score}%
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {job.budget_max_inr ? formatInr(job.budget_max_inr) : "Budget flexible"} ·{" "}
                {job.timeline_weeks ? `${job.timeline_weeks} wks` : "Flexible timeline"}
              </p>
              {matching.length > 0 && (
                <p className="mt-3 text-xs text-primary">Matching skills: {matching.join(", ")}</p>
              )}
              {missing.length > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">Missing: {missing.join(", ")}</p>
              )}
            </article>
          ))
        )}
      </div>
    </DashShell>
  );
}

type MatchedJob = {
  job: {
    id: string;
    title: string;
    slug: string;
    description: string;
    skills: string[];
    budget_min_inr: number | null;
    budget_max_inr: number | null;
    timeline_weeks: number | null;
  };
  score: number;
  matching: string[];
  missing: string[];
  reasons: string[];
};
