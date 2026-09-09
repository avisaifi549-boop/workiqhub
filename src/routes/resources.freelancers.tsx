import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import {
  Breadcrumbs,
  PageHero,
  Section,
  CardGrid,
  InfoCard,
  Steps,
  CtaRow,
} from "@/components/site/Sections";
import { GUIDES } from "@/lib/site/guides";

export const Route = createFileRoute("/resources/freelancers")({
  head: () => ({
    meta: [
      { title: "Freelancer resources — profiles, pricing, proposals and delivery" },
      {
        name: "description",
        content:
          "Practical resources for freelancers: build a profile that gets found, price your work properly, write proposals that get replies and deliver projects that lead to repeat clients.",
      },
      { property: "og:title", content: "Freelancer resources — WorkIQHub" },
      {
        property: "og:description",
        content: "Profiles, pricing, proposals, delivery and repeat clients.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/resources/freelancers" }],
  }),
  component: FreelancerResources,
});

function FreelancerResources() {
  const guides = GUIDES.filter((g) => g.audience !== "clients");
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Resources", to: "/resources" }, { label: "Freelancers" }]} />
      <PageHero
        kicker="For freelancers"
        title="Build a freelance career, not just a profile"
        lead="The sequence that actually matters: position yourself narrowly, prove it with real work, price from your costs, apply selectively, deliver cleanly, and let verified reviews compound."
      />

      <Section title="The path">
        <Steps
          items={[
            "Position: pick a discipline and context",
            "Prove: profile and portfolio with evidence",
            "Price: rates from costs and capacity",
            "Pitch: fewer, better proposals",
            "Deliver: to the milestone as written",
            "Repeat: verified reviews and returning clients",
          ]}
        />
      </Section>

      <Section title="Guides for freelancers">
        <CardGrid cols={3}>
          {guides.map((g) => (
            <InfoCard
              key={g.slug}
              meta={`${g.readMinutes} min read`}
              title={g.title}
              body={g.summary}
              to={`/guides/${g.slug}`}
            />
          ))}
        </CardGrid>
      </Section>

      <Section title="Tools that save you time">
        <CardGrid cols={3}>
          <InfoCard
            title="Freelance rate calculator"
            body="Work out an hourly rate from the income you need and the hours you can actually bill."
            to="/tools/rate-calculator"
          />
          <InfoCard
            title="Invoice generator"
            body="Produce a clean, printable invoice with tax and totals calculated for you."
            to="/tools/invoice-generator"
          />
          <InfoCard
            title="Proposal generator"
            body="Structure a proposal around the client's brief instead of starting from a blank page."
            to="/tools/proposal-generator"
          />
          <InfoCard
            title="Profile score"
            body="Score a profile draft against the same completeness checks the platform uses."
            to="/tools/profile-score"
          />
        </CardGrid>
      </Section>

      <Section title="Find work now">
        <CardGrid cols={3}>
          <InfoCard title="Job board" body="Every open project, filterable by category." to="/jobs" />
          <InfoCard
            title="Development jobs"
            body="Web, mobile, backend and platform work."
            to="/jobs/c/development"
          />
          <InfoCard
            title="Design jobs"
            body="Product, brand and visual design projects."
            to="/jobs/c/design"
          />
        </CardGrid>
      </Section>

      <CtaRow
        primary={{ label: "Start freelancing", to: "/get-started" }}
        secondary={{ label: "Browse jobs", to: "/jobs" }}
      />
    </PageShell>
  );
}
