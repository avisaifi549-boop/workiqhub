import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, PageHero, Prose } from "@/components/site/Sections";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — WorkIQHub marketplace" },
      {
        name: "description",
        content:
          "Marketplace terms covering client and freelancer responsibilities, payments, reviews, prohibited activity, disputes, termination, intellectual property and refunds.",
      },
      { property: "og:title", content: "Terms of Service — WorkIQHub marketplace" },
      {
        property: "og:description",
        content: "Responsibilities, payments, reviews, disputes, IP and refunds.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "1. About these terms",
    body: [
      "These terms govern use of the WorkIQHub marketplace operated by [COMPANY LEGAL NAME], [REGISTERED ADDRESS]. By creating an account you agree to them.",
      "WorkIQHub provides the platform. Contracts for work are between the client and the freelancer.",
    ],
  },
  {
    heading: "2. Accounts",
    body: [
      "You must provide accurate information and keep your credentials secure.",
      "One person or organisation per account. Duplicate accounts created to evade moderation or manipulate reputation may be removed.",
    ],
  },
  {
    heading: "3. Client responsibilities",
    body: [
      "Describe projects accurately, including scope, budget range and timeline.",
      "Fund agreed milestones before work begins on them, and review submitted work within a reasonable period.",
      "Do not use the platform to solicit unpaid speculative work, and do not request work outside the agreed scope without a new milestone.",
      "Approve and release payment for work that meets the agreed milestone description.",
    ],
  },
  {
    heading: "4. Freelancer responsibilities",
    body: [
      "Represent your skills, experience, portfolio and credentials truthfully. Fabricated experience, clients, results or certifications are grounds for removal.",
      "Deliver work that matches the agreed milestone, and communicate promptly about delays.",
      "Only submit work you have the right to deliver.",
    ],
  },
  {
    heading: "5. Payments",
    body: [
      "Project payments are milestone based: funded before work, released on client approval.",
      "Optional freelancer subscriptions are billed on a recurring basis until cancelled. [BILLING TERMS, TAXES, CURRENCY AND CANCELLATION NOTICE — legal review required.]",
      "[PLATFORM FEE STRUCTURE — to be completed.]",
    ],
  },
  {
    heading: "6. Reviews",
    body: [
      "Reviews may only be created after a completed project between the two parties, and each party may leave one review per project.",
      "Buying, selling, exchanging or coercing reviews is prohibited. Reviews found to be fraudulent are removed.",
      "Reviews may be reported and are investigated by moderators.",
    ],
  },
  {
    heading: "7. Prohibited activity",
    body: [
      "Misrepresentation, fraud, harassment, discrimination, spam, scraping, circumvention of platform payments, malware, and any unlawful activity.",
      "Sharing another person's private information, or attempting to move a contact off-platform to avoid protections and fees.",
    ],
  },
  {
    heading: "8. Disputes",
    body: [
      "Parties should first attempt to resolve disagreements within the project using revision requests.",
      "Unresolved disputes may be escalated for review of the project record. [DISPUTE PROCESS, TIMELINES AND BINDING EFFECT — legal review required.]",
    ],
  },
  {
    heading: "9. Account termination",
    body: [
      "You may close your account at any time. Obligations under active contracts survive closure.",
      "We may suspend or terminate accounts that breach these terms or present a risk to other users. [APPEAL PROCESS — to be completed.]",
    ],
  },
  {
    heading: "10. Intellectual property",
    body: [
      "Ownership of deliverables is agreed between client and freelancer in the contract. In the absence of an agreement, [DEFAULT POSITION — legal review required].",
      "Content you publish on the platform remains yours; you grant us a licence to display it as part of operating the marketplace.",
    ],
  },
  {
    heading: "11. Refunds",
    body: [
      "Funded milestones that were never approved may be refunded as part of a dispute outcome.",
      "[SUBSCRIPTION REFUND POLICY AND STATUTORY RIGHTS — legal review required.]",
    ],
  },
  {
    heading: "12. Liability and governing law",
    body: [
      "[LIMITATION OF LIABILITY, WARRANTIES, INDEMNITIES, GOVERNING LAW AND JURISDICTION — must be drafted and reviewed by legal counsel.]",
    ],
  },
];

function Terms() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Terms" }]} />
      <PageHero
        kicker="Legal"
        title="Terms of Service"
        lead="The rules for using the marketplace, separated by the responsibilities each side takes on. Bracketed items are placeholders requiring completion and review by a qualified legal professional."
      />
      <p className="rounded-lg border border-border glass px-5 py-4 font-mono text-xs text-muted-foreground">
        DRAFT — Effective date: [DATE]. Marked for legal review before production use.
      </p>

      <div className="space-y-10 py-12">
        {SECTIONS.map((s) => (
          <section key={s.heading} className="border-t border-border pt-8">
            <h2 className="font-display text-2xl uppercase tracking-tight">{s.heading}</h2>
            <div className="mt-4">
              <Prose>
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Prose>
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
