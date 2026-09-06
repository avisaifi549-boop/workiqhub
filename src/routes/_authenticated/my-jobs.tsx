import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccount } from "@/lib/account";
import { supabase } from "@/integrations/supabase/client";
import { DashShell } from "@/components/dash/DashShell";
import { CardSkeleton, EmptyState } from "@/components/site/EmptyState";
import { GhostButton, PrimaryButton } from "@/components/dash/fields";
import { formatInr } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/my-jobs")({
  head: () => ({
    meta: [
      { title: "My jobs & applicants — Loom" },
      { name: "description", content: "Review applicants, shortlist and hire for your posted jobs." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyJobsPage,
});

function MyJobsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: account } = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => fetchAccount(user!.id),
    enabled: !!user,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["my-jobs", user?.id],
    queryFn: async () => {
      const jobs =
        (
          await supabase
            .from("jobs")
            .select("id, title, slug, status, budget_min_inr, budget_max_inr, created_at")
            .eq("client_id", user!.id)
            .order("created_at", { ascending: false })
        ).data ?? [];
      const ids = jobs.map((j) => j.id);
      const applications = ids.length
        ? ((
            await supabase
              .from("applications")
              .select(
                "id, job_id, status, bid_amount_inr, delivery_days, cover_letter, created_at, freelancer_id",
              )
              .in("job_id", ids)
              .order("created_at", { ascending: false })
          ).data ?? [])
        : [];
      const freelancerIds = [...new Set(applications.map((a) => a.freelancer_id))];
      const people = freelancerIds.length
        ? ((
            await supabase
              .from("freelancer_profiles")
              .select("user_id, slug, headline, skills, profiles(full_name)")
              .in("user_id", freelancerIds)
          ).data ?? [])
        : [];
      return { jobs, applications, people };
    },
    enabled: !!user,
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase
      .from("applications")
      .update({ status: status as never })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Applicant updated");
    await qc.invalidateQueries({ queryKey: ["my-jobs", user?.id] });
  }

  return (
    <DashShell
      role={account?.role ?? "client"}
      title="My jobs & applicants"
      subtitle="Shortlist, interview and hire from the people who applied."
      actions={
        <Link
          to="/post-a-job"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Post a project
        </Link>
      }
    >
      {isLoading ? (
        <CardSkeleton count={2} />
      ) : !data?.jobs.length ? (
        <EmptyState
          title="You haven't posted your first project yet"
          description="Post a project and qualified freelancers will start applying."
          action={
            <Link
              to="/post-a-job"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Post a project
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {data.jobs.map((job) => {
            const apps = data.applications.filter((a) => a.job_id === job.id);
            return (
              <section key={job.id} className="glass rounded-2xl border border-border p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-tight">
                    <Link to="/jobs/$slug" params={{ slug: job.slug }} className="hover:text-primary">
                      {job.title}
                    </Link>
                  </h2>
                  <span className="font-mono text-xs text-muted-foreground">
                    {apps.length} applicant{apps.length === 1 ? "" : "s"} ·{" "}
                    {job.budget_max_inr ? formatInr(job.budget_max_inr) : "Budget flexible"}
                  </span>
                </div>

                {apps.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No applications yet. Freelancers matched to these skills will see it in their feed.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {apps.map((a) => {
                      const person = data.people.find((p) => p.user_id === a.freelancer_id);
                      const name =
                        (person?.profiles as { full_name: string } | null)?.full_name ?? "Freelancer";
                      return (
                        <div key={a.id} className="rounded-xl border border-border bg-accent/30 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">
                                {person?.slug ? (
                                  <Link
                                    to="/freelancer/$slug"
                                    params={{ slug: person.slug }}
                                    className="hover:text-primary"
                                  >
                                    {name}
                                  </Link>
                                ) : (
                                  name
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">{person?.headline}</p>
                            </div>
                            <span className="rounded-md bg-primary/15 px-2.5 py-1 font-mono text-[11px] uppercase text-primary">
                              {a.status}
                            </span>
                          </div>
                          {a.cover_letter && (
                            <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
                              {a.cover_letter}
                            </p>
                          )}
                          <p className="mt-3 font-mono text-xs text-muted-foreground">
                            Bid {a.bid_amount_inr ? formatInr(a.bid_amount_inr) : "—"} ·{" "}
                            {a.delivery_days ? `${a.delivery_days} days` : "Flexible"}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <GhostButton onClick={() => void setStatus(a.id, "shortlisted")}>
                              Shortlist
                            </GhostButton>
                            <GhostButton onClick={() => void setStatus(a.id, "interview")}>
                              Interview
                            </GhostButton>
                            <PrimaryButton onClick={() => void setStatus(a.id, "hired")}>
                              Hire
                            </PrimaryButton>
                            <GhostButton onClick={() => void setStatus(a.id, "rejected")}>
                              Not a fit
                            </GhostButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </DashShell>
  );
}
