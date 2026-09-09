import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DashShell } from "@/components/dash/DashShell";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccount } from "@/lib/account";
import { PLANS, formatInr } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/subscription")({
  head: () => ({
    meta: [{ title: "Your plan — WorkIQHub" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: SubscriptionPage,
});

function SubscriptionPage() {
  const { user } = useAuth();
  const { data: account } = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => fetchAccount(user!.id),
    enabled: Boolean(user?.id),
  });

  const role = account?.role ?? "freelancer";

  if (account && role === "client") {
    return (
      <DashShell
        role="client"
        title="Plans"
        subtitle="Subscription plans are for freelancers only."
      >
        <div className="glass rounded-2xl border border-border p-8">
          <p className="max-w-[56ch] text-muted-foreground">
            Hiring on WorkIQHub does not require a subscription. You post projects, fund milestones and
            release payment as work is approved — there is no plan to choose on a client account.
          </p>
          <Link
            to="/post-a-job"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Post a project
          </Link>
        </div>
      </DashShell>
    );
  }

  const current = account?.freelancer?.plan ?? "free";

  return (
    <DashShell
      role="freelancer"
      title="Your plan"
      subtitle="Every paid feature exists to help you get discovered and win work — never a cosmetic badge."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.tier === current;
          return (
            <div
              key={plan.tier}
              className={
                plan.mostPopular
                  ? "relative rounded-2xl border border-primary/40 bg-primary/10 p-6 ring-1 ring-primary/30"
                  : "glass rounded-2xl border border-border p-6"
              }
            >
              {plan.mostPopular && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 font-mono text-[11px] font-medium text-primary-foreground">
                  MOST POPULAR
                </span>
              )}
              <p
                className={
                  plan.mostPopular
                    ? "font-mono text-xs uppercase tracking-[0.2em] text-primary"
                    : "label-mono"
                }
              >
                {plan.name}
              </p>
              <p className="mt-3 font-display text-4xl">{formatInr(plan.priceInr)}</p>
              <p className="font-mono text-xs text-muted-foreground">/month · {plan.tagline}</p>
              <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                {plan.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className="mt-5 space-y-1.5 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
                <p>{plan.entitlements.monthlyApplications} applications / month</p>
                <p>{plan.entitlements.monthlyAiProposals} AI proposals / month</p>
                <p>{plan.entitlements.portfolioItems} portfolio items</p>
              </div>
              <button
                type="button"
                disabled
                className={
                  isCurrent
                    ? "mt-6 w-full rounded-lg border border-primary/50 px-4 py-2.5 text-sm font-semibold text-primary"
                    : "mt-6 w-full rounded-lg glass px-4 py-2.5 text-sm font-semibold ring-1 ring-border opacity-70"
                }
              >
                {isCurrent ? "Current plan" : "Checkout coming soon"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-8 font-mono text-xs text-muted-foreground">
        Paid plans never override search relevance, and verification can never be bought. Promoted
        placements are always labelled.
      </p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        Online plan checkout is not live yet — your account stays on Free until it is.
      </p>
    </DashShell>
  );
}
