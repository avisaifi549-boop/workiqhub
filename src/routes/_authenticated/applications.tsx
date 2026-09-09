import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccount } from "@/lib/account";
import { supabase } from "@/integrations/supabase/client";
import { DashShell } from "@/components/dash/DashShell";
import { EmptyState, CardSkeleton } from "@/components/site/EmptyState";
import { GhostButton } from "@/components/dash/fields";
import { formatInr } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/applications")({
  head: () => ({
    meta: [
      { title: "My applications — WorkIQHub" },
      { name: "description", content: "Track every proposal you've sent and its current status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ApplicationsPage,
});

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  shortlisted: "Shortlisted",
  interview: "Interview",
  hired: "Hired",
  rejected: "Not selected",
  withdrawn: "Withdrawn",
};

function ApplicationsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: account } = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => fetchAccount(user!.id),
    enabled: !!user,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["my-applications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(
          "id, status, bid_amount_inr, delivery_days, cover_letter, created_at, jobs(title, slug, budget_min_inr, budget_max_inr)",
        )
        .eq("freelancer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: !!user,
  });

  async function withdraw(id: string) {
    const { error } = await supabase
      .from("applications")
      .update({ status: "withdrawn" })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Application withdrawn");
    await qc.invalidateQueries({ queryKey: ["my-applications", user?.id] });
  }

  return (
    <DashShell
      role={account?.role ?? "freelancer"}
      title="My applications"
      subtitle="Every proposal you've sent, with its live status."
    >
      {isLoading ? (
        <CardSkeleton count={3} />
      ) : !data?.length ? (
        <EmptyState
          title="No applications yet"
          description="Once you apply to a job, you'll be able to track its progress here."
          action={
            <Link
              to="/jobs"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Find jobs
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {data.map((a) => {
            const job = a.jobs as { title: string; slug: string } | null;
            return (
              <article key={a.id} className="glass rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      {job ? (
                        <Link
                          to="/jobs/$slug"
                          params={{ slug: job.slug }}
                          className="hover:text-primary"
                        >
                          {job.title}
                        </Link>
                      ) : (
                        "Job removed"
                      )}
                    </h2>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      Applied {new Date(a.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span className="rounded-md bg-primary/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-primary">
                    {STATUS_LABEL[a.status] ?? a.status}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="label-mono">Your bid</p>
                    <p className="mt-1 text-sm font-semibold">
                      {a.bid_amount_inr ? formatInr(a.bid_amount_inr) : "Not specified"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="label-mono">Delivery</p>
                    <p className="mt-1 text-sm font-semibold">
                      {a.delivery_days ? `${a.delivery_days} days` : "Flexible"}
                    </p>
                  </div>
                </div>
                {a.cover_letter && (
                  <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                    {a.cover_letter}
                  </p>
                )}
                {["submitted", "shortlisted"].includes(a.status) && (
                  <div className="mt-4">
                    <GhostButton onClick={() => void withdraw(a.id)}>Withdraw</GhostButton>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </DashShell>
  );
}
