import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, PageHero, Section, Prose, CardGrid, InfoCard } from "@/components/site/Sections";

export const Route = createFileRoute("/success-stories")({
  head: () => ({
    meta: [
      { title: "Success stories — WorkIQHub" },
      {
        name: "description",
        content:
          "WorkIQHub only publishes success stories from real, completed marketplace projects with the consent of both parties. Here is how they get published.",
      },
      { property: "og:title", content: "Success stories — WorkIQHub" },
      {
        property: "og:description",
        content: "Real completed projects only — no invented testimonials.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "/success-stories" }],
  }),
  component: SuccessStories,
});

function SuccessStories() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Success stories" }]} />
      <PageHero
        kicker="Success stories"
        title="Stories from real projects only"
        lead="We do not write testimonials. A story appears here only when it comes from a completed marketplace project and both the client and the freelancer agree to it being published."
      />

      <Section title="No published stories yet">
        <div className="glass-strong rounded-2xl border border-border p-8">
          <h3 className="text-lg font-semibold">This page is waiting on real work</h3>
          <p className="mt-2 max-w-[56ch] text-sm text-muted-foreground">
            Rather than fill it with invented quotes, we are leaving it empty until completed
            projects and their verified reviews are ready to feature. In the meantime, verified
            reviews already appear on individual freelancer profiles as projects complete.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/freelancers"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Browse verified talent
            </Link>
            <Link
              to="/get-started"
              className="rounded-lg glass px-5 py-3 text-sm font-semibold ring-1 ring-border"
            >
              Start freelancing
            </Link>
          </div>
        </div>
      </Section>

      <Section title="How a story gets published">
        <CardGrid cols={3}>
          <InfoCard
            title="1. A project completes"
            body="The contract reaches a completed state with milestones approved and released."
          />
          <InfoCard
            title="2. Both sides review"
            body="Two-sided verified reviews are left, each tied to that specific project."
          />
          <InfoCard
            title="3. Both sides consent"
            body="Nothing is published without explicit permission from the client and the freelancer."
          />
        </CardGrid>
      </Section>

      <Section title="Why we do it this way">
        <Prose>
          <p>
            Invented testimonials are easy to write and impossible to trust. Once one is published,
            every genuine story on the page becomes worth less. Keeping this page honest, even while
            it is empty, is the point.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
