import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccount } from "@/lib/account";
import { supabase } from "@/integrations/supabase/client";
import { DashShell } from "@/components/dash/DashShell";
import { CardSkeleton, EmptyState } from "@/components/site/EmptyState";
import { averageRating, ratingBreakdown } from "@/lib/marketplace";

export const Route = createFileRoute("/_authenticated/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Loom" },
      { name: "description", content: "Verified reviews from projects completed on Loom." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { user } = useAuth();

  const { data: account } = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => fetchAccount(user!.id),
    enabled: !!user,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["my-reviews", user?.id],
    queryFn: async () => {
      const [received, given] = await Promise.all([
        supabase
          .from("reviews")
          .select("*")
          .eq("reviewee_id", user!.id)
          .eq("is_hidden", false)
          .order("created_at", { ascending: false }),
        supabase
          .from("reviews")
          .select("*")
          .eq("reviewer_id", user!.id)
          .order("created_at", { ascending: false }),
      ]);
      return { received: received.data ?? [], given: given.data ?? [] };
    },
    enabled: !!user,
  });

  const received = data?.received ?? [];
  const avg = averageRating(received);
  const breakdown = ratingBreakdown(received);

  return (
    <DashShell
      role={account?.role ?? "freelancer"}
      title="Reviews"
      subtitle="Only projects completed and paid through Loom can generate a review."
    >
      {isLoading ? (
        <CardSkeleton count={2} />
      ) : received.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Complete your first project on Loom to receive your first verified review."
        />
      ) : (
        <div className="space-y-6">
          <div className="glass flex flex-wrap items-center gap-8 rounded-2xl border border-border p-6">
            <div className="text-center">
              <p className="font-display text-5xl text-primary">{avg?.toFixed(1)}</p>
              <p className="label-mono mt-1">{received.length} verified reviews</p>
            </div>
            <div className="min-w-56 flex-1 space-y-1.5">
              {breakdown.map((b) => (
                <div key={b.star} className="flex items-center gap-3 text-xs">
                  <span className="w-6 font-mono text-muted-foreground">{b.star}★</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent/60">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${b.pct}%` }}
                    />
                  </span>
                  <span className="w-10 text-right font-mono text-muted-foreground">{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {received.map((r) => (
              <article key={r.id} className="glass rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{r.title || "Verified review"}</p>
                  <span className="font-mono text-xs text-primary">
                    ✓ Verified project · {Number(r.rating).toFixed(1)}★
                  </span>
                </div>
                {r.body && <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>}
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("en-IN")}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </DashShell>
  );
}
