import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import {
  Breadcrumbs,
  PageHero,
  Section,
  CardGrid,
  InfoCard,
  Prose,
  CtaRow,
} from "@/components/site/Sections";

export const Route = createFileRoute("/trust-and-safety")({
  head: () => ({
    meta: [
      { title: "Trust & Safety — how Loom protects work and payments" },
      {
        name: "description",
        content:
          "Account safety, identity and skill verification, secure communication, payment protection, fraud prevention, review integrity, reporting, blocking and dispute resolution on Loom.",
      },
      { property: "og:title", content: "Trust & Safety on Loom" },
      {
        property: "og:description",
        content: "Verification, payment protection, review integrity, reporting and disputes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/trust-and-safety" }],
  }),
  component: TrustSafety,
});

const PILLARS = [
  ["Account safety", "Accounts are protected by authenticated sessions, and access to your records is enforced at the database level so no other account can read them."],
  ["Identity verification", "Identity information is reviewed by our team. Documents are used for verification only and never shown publicly."],
  ["Skill verification", "Claimed expertise is reviewed against evidence. Skill verification cannot be bought with a subscription."],
  ["Secure communication", "Project conversation belongs with the project record, so what was agreed can always be reconstructed."],
  ["Payment protection", "Milestones are funded before work and released after approval, so neither side carries the whole risk."],
  ["Fraud prevention", "Duplicate account signals, spam patterns and suspicious payment behaviour are monitored and actioned."],
  ["Review integrity", "A review can only be created from a completed contract between the two parties, enforced in the database."],
  ["Reporting", "Profiles, jobs, messages and reviews can be reported, and reports are reviewed by moderators."],
  ["Blocking", "You can stop further contact from an account you do not want to work with."],
  ["Dispute resolution", "When a milestone cannot be agreed, either side can escalate and our team reviews the project record."],
  ["Privacy", "Email, phone and payment details are never published on a public profile or exposed to search engines."],
] as const;

function TrustSafety() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Trust & safety" }]} />
      <PageHero
        kicker="Trust & safety"
        title="Protection built into the workflow"
        lead="Safety on a marketplace is a set of mechanisms, not a promise. These are the ones Loom actually operates — and the limits of each are stated plainly."
      />

      <Section title="How we protect both sides">
        <CardGrid cols={3}>
          {PILLARS.map(([t, b]) => (
            <InfoCard key={t} title={t} body={b} />
          ))}
        </CardGrid>
      </Section>

      <Section title="Why reviews are tied to real work">
        <Prose>
          <p>
            A review on Loom can only exist where a contract between those two accounts reached a
            completed state. Each party can leave one review per project, and self-reviews are
            impossible. That is enforced by database rules, not by a policy page.
          </p>
          <p>
            The trade-off is that a new profile starts with no reviews. We think that is better than
            a marketplace where ratings can be traded, bought or manufactured.
          </p>
        </Prose>
      </Section>

      <Section title="What to do if something goes wrong">
        <Prose>
          <p>
            Raise it in the project first — most problems are a scope misunderstanding and a
            revision request resolves them. If it cannot be resolved between you, escalate it.
          </p>
        </Prose>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Report a problem
          </Link>
          <Link
            to="/help/disputes"
            className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border"
          >
            Dispute center
          </Link>
        </div>
      </Section>

      <CtaRow
        primary={{ label: "Read the FAQs", to: "/faqs" }}
        secondary={{ label: "Contact support", to: "/contact" }}
      />
    </PageShell>
  );
}
