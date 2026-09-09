import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, PageHero, Section, Steps, Prose, FaqList } from "@/components/site/Sections";

export const Route = createFileRoute("/help/disputes")({
  head: () => ({
    meta: [
      { title: "Dispute Center — resolving project disagreements | Loom" },
      {
        name: "description",
        content:
          "How disputes work on Loom: try a revision request first, then escalate. What our team reviews, what evidence matters and what outcomes are possible.",
      },
      { property: "og:title", content: "Dispute Center — Loom" },
      {
        property: "og:description",
        content: "Revision requests, escalation, evidence and possible outcomes.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/help/disputes" }],
  }),
  component: Disputes,
});

function Disputes() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Help center", to: "/help" }, { label: "Dispute center" }]} />
      <PageHero
        kicker="Dispute center"
        title="When a milestone cannot be agreed"
        lead="Most disagreements are a scope misunderstanding and resolve within the project. When they do not, either side can escalate and our team reviews the record."
      />

      <Section title="The process">
        <Steps
          items={[
            "Request a revision inside the milestone",
            "Restate the agreed scope in writing",
            "Escalate if it stays unresolved",
            "Our team reviews the project record and decides",
          ]}
        />
      </Section>

      <Section title="What we look at">
        <Prose>
          <p>
            The contract and milestone descriptions as written, what was submitted against them, the
            project conversation, and the timeline of state changes. This is why keeping the whole
            project in one place matters — a dispute is only as resolvable as its record.
          </p>
          <p>
            Possible outcomes include release of the funded milestone, a partial release, a refund
            of a milestone that was never approved, or cancellation of the remaining contract.
          </p>
        </Prose>
      </Section>

      <Section title="Common questions">
        <FaqList
          items={[
            {
              q: "Can I escalate before funding a milestone?",
              a: "There is nothing to arbitrate before funding. If you have not agreed scope, revise the milestone or cancel before funding it.",
            },
            {
              q: "Does raising a dispute affect my reviews?",
              a: "A dispute does not create or remove a review. Reviews still require a completed project, and cannot be used to pressure the other party.",
            },
            {
              q: "How long does review take?",
              a: "It depends on the complexity of the project record. We ask both sides for anything missing before deciding.",
            },
            {
              q: "Can I keep working during a dispute?",
              a: "You can, but new work should be covered by a new milestone so it does not get mixed into the disputed one.",
            },
          ]}
        />
      </Section>

      <Section title="Raise a dispute">
        <p className="text-muted-foreground">
          Open the project in your dashboard to request a revision. To escalate, contact support and
          choose Payment Issue with the project details.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Escalate to support
          </Link>
          <Link
            to="/projects"
            className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border"
          >
            Open my projects
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
