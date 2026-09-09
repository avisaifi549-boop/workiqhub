import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, PageHero, Prose } from "@/components/site/Sections";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — WorkIQHub" },
      {
        name: "description",
        content:
          "How WorkIQHub collects, uses, shares and retains personal information, and the choices available to account holders.",
      },
      { property: "og:title", content: "Privacy Policy — WorkIQHub" },
      {
        property: "og:description",
        content: "How WorkIQHub handles personal information and the choices available to you.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "1. Who we are",
    body: [
      "[COMPANY LEGAL NAME], [REGISTERED ADDRESS], operates the WorkIQHub marketplace. Where this policy refers to 'we' or 'us', it means that entity.",
      "Contact for privacy matters: [PRIVACY CONTACT EMAIL].",
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      "Account information you provide: name, email address, account type, and optionally phone number, location and profile photo.",
      "Profile content you publish: headline, biography, skills, languages, pricing, availability, portfolio items and services.",
      "Marketplace activity: jobs posted, applications, contracts, milestones, reviews, reports and notifications.",
      "Verification information submitted for review, including identity documents where you choose to request identity verification.",
      "Technical information generated when you use the service, such as log data and device information.",
    ],
  },
  {
    heading: "3. How we use information",
    body: [
      "To operate your account and the marketplace features you use.",
      "To match jobs and freelancers, and to generate profile and proposal assistance from data you have provided.",
      "To verify identity and skills where you request it, and to detect fraud, spam and duplicate accounts.",
      "To process payments and maintain financial records.",
      "To provide support and to communicate about your account and projects.",
    ],
  },
  {
    heading: "4. What is public",
    body: [
      "A published freelancer profile is public and may be indexed by search engines. It includes your display name, headline, biography, skills, portfolio, pricing, availability and reviews from completed projects.",
      "Your email address, phone number, payment details and verification documents are never shown publicly.",
      "You can unpublish your profile at any time, which removes it from the public directory.",
    ],
  },
  {
    heading: "5. Sharing",
    body: [
      "With the other party to a project, to the extent needed to run that project.",
      "With service providers who host our infrastructure, process payments and deliver email, under contract.",
      "Where required by law, or to investigate fraud, abuse or a dispute.",
      "[LIST OF PROCESSORS AND JURISDICTIONS — to be completed and reviewed by legal counsel.]",
    ],
  },
  {
    heading: "6. Retention",
    body: [
      "Account and profile data is retained while your account is active.",
      "Records tied to completed contracts, payments and disputes may be retained for longer where required for financial, tax or legal reasons. [SPECIFY RETENTION PERIODS — legal review required.]",
    ],
  },
  {
    heading: "7. Your rights",
    body: [
      "Depending on where you live, you may have rights to access, correct, export, restrict or delete your personal information, and to object to certain processing.",
      "To exercise a right, contact us through the contact page. [DESCRIBE VERIFICATION AND RESPONSE PROCESS — legal review required.]",
    ],
  },
  {
    heading: "8. Security",
    body: [
      "Access to account data is restricted at the database level so accounts cannot read each other's private records. No system is perfectly secure; report a suspected issue through the contact page.",
    ],
  },
  {
    heading: "9. International transfers",
    body: ["[TRANSFER MECHANISMS AND SAFEGUARDS — to be completed by legal counsel.]"],
  },
  {
    heading: "10. Children",
    body: [
      "The service is not intended for anyone under [MINIMUM AGE]. Accounts believed to belong to children are closed.",
    ],
  },
  {
    heading: "11. Changes",
    body: [
      "We will post changes on this page and update the effective date. Material changes will be notified to account holders.",
    ],
  },
];

function Privacy() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Privacy" }]} />
      <PageHero
        kicker="Legal"
        title="Privacy Policy"
        lead="This page describes what information WorkIQHub collects, how it is used and the choices you have. Bracketed items are placeholders that must be completed and reviewed by a qualified legal professional before production use."
      />
      <p className="rounded-lg border border-border glass px-5 py-4 font-mono text-xs text-muted-foreground">
        DRAFT — Effective date: [DATE]. Pending legal review.
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
