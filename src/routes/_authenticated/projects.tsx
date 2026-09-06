import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccount, fetchContracts } from "@/lib/account";
import { supabase } from "@/integrations/supabase/client";
import { DashShell } from "@/components/dash/DashShell";
import { CardSkeleton, EmptyState } from "@/components/site/EmptyState";
import { CONTRACT_STATUS_LABEL, MILESTONE_STATUS_LABEL } from "@/lib/marketplace";
import { formatInr } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({
    meta: [
      { title: "My projects — Loom" },
      {
        name: "description",
        content: "Track contracts, milestones and payment status end to end.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { user } = useAuth();

  const { data: account } = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => fetchAccount(user!.id),
    enabled: !!user,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["contracts", user?.id],
    queryFn: async () => {
      const contracts = await fetchContracts(user!.id);
      const ids = contracts.map((c) => c.id);
      const milestones = ids.length
        ? ((
            await supabase
              .from("milestones")
              .select("id, contract_id, title, amount_inr, due_date, status, sort_order")
              .in("contract_id", ids)
              .order("sort_order")
          ).data ?? [])
        : [];
      return { contracts, milestones };
    },
    enabled: !!user,
  });

  const role = account?.role ?? "freelancer";

  return (
    <DashShell
      role={role}
      title="My projects"
      subtitle="Hired work, milestones and payment status in one place."
    >
      {isLoading ? (
        <CardSkeleton count={2} />
      ) : !data?.contracts.length ? (
        <EmptyState
          title="No projects yet"
          description={
            role === "client"
              ? "When you hire a freelancer, the contract and its milestones appear here."
              : "When a client hires you, the contract and its milestones appear here."
          }
        />
      ) : (
        <div className="space-y-5">
          {data.contracts.map((c) => {
            const ms = data.milestones.filter((m) => m.contract_id === c.id);
            return (
              <article key={c.id} className="glass rounded-2xl border border-border p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">{c.title}</h2>
                    {c.deadline && (
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        Due {new Date(c.deadline).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="rounded-md bg-primary/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-primary">
                      {CONTRACT_STATUS_LABEL[c.status] ?? c.status}
                    </span>
                    <p className="mt-2 text-sm font-semibold">{formatInr(c.amount_inr)}</p>
                  </div>
                </div>
                {c.description && (
                  <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
                )}
                <div className="mt-5">
                  <p className="label-mono">Milestones</p>
                  {ms.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No milestones added to this project yet.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {ms.map((m) => (
                        <li
                          key={m.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-accent/40 px-3 py-2.5 text-sm"
                        >
                          <span className="font-medium">{m.title}</span>
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-xs text-muted-foreground">
                              {MILESTONE_STATUS_LABEL[m.status] ?? m.status}
                            </span>
                            <span className="font-semibold">{formatInr(m.amount_inr)}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </DashShell>
  );
}
