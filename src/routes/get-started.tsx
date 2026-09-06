import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionLabel } from "@/components/site/PageShell";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Get started on Loom — hire or start freelancing" },
      {
        name: "description",
        content:
          "Choose how you want to use Loom: hire trusted freelancers for your project, or start freelancing and grow your career.",
      },
      { property: "og:title", content: "Get started on Loom" },
      {
        property: "og:description",
        content: "Hire trusted talent, or showcase your skills and find better opportunities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GetStarted,
});

const CARDS = [
  {
    role: "client" as const,
    kicker: "Hire a freelancer",
    headline: "Find trusted talent for your next project.",
    points: [
      "Post a project in minutes",
      "Compare verified freelancers and portfolios",
      "Fund milestones and approve work safely",
    ],
    cta: "Hire a freelancer",
  },
  {
    role: "freelancer" as const,
    kicker: "Start freelancing",
    headline: "Showcase your skills. Find better opportunities.",
    points: [
      "Build a public profile that ranks on Google",
      "Publish services clients can buy directly",
      "Earn verified reviews from real projects",
    ],
    cta: "Start freelancing",
  },
];

function GetStarted() {
  return (
    <PageShell>
      <section className="py-14 sm:py-20">
        <SectionLabel index="01">Get started</SectionLabel>
        <h1 className="mt-4 max-w-2xl font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
          What are you here to do?
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Pick a side to continue. You only answer the questions that matter for your role — and you
          can always finish setting up later.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {CARDS.map((card) => (
            <Link
              key={card.role}
              to="/auth"
              search={{ mode: "signup", role: card.role }}
              className="group glass-strong flex flex-col rounded-2xl border border-border p-7 transition-all hover:-translate-y-1 hover:border-primary/60"
            >
              <span className="label-mono text-primary">{card.kicker}</span>
              <h2 className="mt-4 font-display text-3xl uppercase leading-tight tracking-tight">
                {card.headline}
              </h2>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-muted-foreground">
                {card.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-primary">—</span>
                    {p}
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                {card.cta} <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth" search={{ mode: "signin" }} className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
