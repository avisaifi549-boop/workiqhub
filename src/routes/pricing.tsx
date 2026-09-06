import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { PLANS, formatInr } from "@/lib/plans";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Freelancer plans and pricing — Loom" },
      {
        name: "description",
        content:
          "Free, Starter ₹299, Pro ₹999 and Elite ₹2,999 plans. Every paid feature is built to win you more clients — never cosmetic.",
      },
      { property: "og:title", content: "Freelancer plans and pricing — Loom" },
      {
        property: "og:description",
        content: "Free, Starter ₹299, Pro ₹999 and Elite ₹2,999 freelancer plans on Loom.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <PageShell>
      <section className="py-16">
        <SectionLabel index="a">Plans</SectionLabel>
        <h1 className="mt-3 max-w-[16ch] font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Pay only when it earns you more
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg text-muted-foreground">
          Every paid feature exists to help you get discovered and win work. No cosmetic badges, no
          paid verification, no buying your way past search relevance.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
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
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className={
                  plan.mostPopular
                    ? "mt-6 block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                    : "mt-6 block rounded-lg glass px-4 py-2.5 text-center text-sm font-semibold ring-1 ring-border"
                }
              >
                {plan.tier === "free" ? "Start free" : `Choose ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-xs text-muted-foreground">
          Paid plans never override search relevance. Promoted profiles are always labelled.
        </p>
      </section>
    </PageShell>
  );
}
