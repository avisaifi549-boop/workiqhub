import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import {
  Breadcrumbs,
  PageHero,
  Section,
  CardGrid,
  InfoCard,
  CtaRow,
} from "@/components/site/Sections";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "Free freelance tools — rate, cost, invoice and proposal generators" },
      {
        name: "description",
        content:
          "Free tools for freelancers and clients: hourly rate calculator, project cost calculator, invoice generator, proposal generator, job description generator and profile score.",
      },
      { property: "og:title", content: "Free freelance tools — Loom" },
      {
        property: "og:description",
        content: "Rate and cost calculators, invoice, proposal and job description generators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: Tools,
});

const TOOLS = [
  [
    "Freelance rate calculator",
    "Turn the income you need and the hours you can bill into an hourly rate you can defend.",
    "/tools/rate-calculator",
    "For freelancers",
  ],
  [
    "Project cost calculator",
    "Build a budget range from scope, complexity, revision rounds and contingency.",
    "/tools/project-cost-calculator",
    "For clients",
  ],
  [
    "Invoice generator",
    "Create a clean, printable invoice with line items, tax and totals calculated for you.",
    "/tools/invoice-generator",
    "For freelancers",
  ],
  [
    "Proposal generator",
    "Structure a proposal around the client's brief, your approach and one piece of evidence.",
    "/tools/proposal-generator",
    "For freelancers",
  ],
  [
    "Job description generator",
    "Turn a rough need into a structured brief with scope, skills, budget and deliverables.",
    "/tools/job-description-generator",
    "For clients",
  ],
  [
    "Freelancer profile score",
    "Score a profile draft against the same completeness checks the marketplace uses.",
    "/tools/profile-score",
    "For freelancers",
  ],
] as const;

function Tools() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Tools" }]} />
      <PageHero
        kicker="Free tools"
        title="Tools that do real work"
        lead="Every tool here runs entirely in your browser. Nothing you type is sent to us or stored, and no account is required."
      />

      <Section title="All tools">
        <CardGrid cols={3}>
          {TOOLS.map(([title, body, to, meta]) => (
            <InfoCard key={to} meta={meta} title={title} body={body} to={to} />
          ))}
        </CardGrid>
      </Section>

      <Section title="Related reading">
        <CardGrid cols={3}>
          <InfoCard
            title="How much should a freelancer charge?"
            body="The reasoning behind the rate calculator, in full."
            to="/guides/how-much-should-a-freelancer-charge"
          />
          <InfoCard
            title="How to write a winning proposal"
            body="What a client is actually deciding when they read your pitch."
            to="/guides/how-to-write-a-winning-proposal"
          />
          <InfoCard
            title="How to hire a freelancer"
            body="From a vague need to a funded, well-scoped project."
            to="/guides/how-to-hire-a-freelancer"
          />
        </CardGrid>
      </Section>

      <CtaRow
        primary={{ label: "Create a free account", to: "/get-started" }}
        secondary={{ label: "Read the guides", to: "/guides" }}
      />
    </PageShell>
  );
}
