import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, PageHero, Section, Prose, CardGrid, InfoCard } from "@/components/site/Sections";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press — Loom" },
      {
        name: "description",
        content:
          "Media enquiries, what Loom is, and the facts we can confirm about how the marketplace works.",
      },
      { property: "og:title", content: "Press — Loom" },
      { property: "og:description", content: "Media enquiries and platform facts." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/press" }],
  }),
  component: Press,
});

function Press() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Press" }]} />
      <PageHero
        kicker="Press"
        title="Media enquiries"
        lead="We answer questions about how the marketplace works and the decisions behind it. We do not publish user numbers, revenue or funding claims we cannot substantiate."
      />

      <Section title="What Loom is">
        <Prose>
          <p>
            Loom is a freelance marketplace covering discovery, proposals, contracts, milestone
            payments and two-sided reviews in a single system. Verification is reviewed by our team
            and cannot be purchased, and reviews are only possible after a completed project between
            the two parties.
          </p>
        </Prose>
      </Section>

      <Section title="Points we can confirm">
        <CardGrid cols={3}>
          <InfoCard
            title="Review integrity"
            body="Review creation is restricted at the database level to completed contracts, one per party per project."
          />
          <InfoCard
            title="Verification policy"
            body="Identity, skill and top talent status are reviewed by our team; subscriptions never change them."
          />
          <InfoCard
            title="AI policy"
            body="AI features are grounded in user-supplied data and do not generate experience, reviews or results."
          />
        </CardGrid>
      </Section>

      <Section title="Contact">
        <p className="text-muted-foreground">
          Send press enquiries through the contact form and choose Press as the reason.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          Contact the team
        </Link>
      </Section>
    </PageShell>
  );
}
