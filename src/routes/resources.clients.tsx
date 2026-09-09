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

export const Route = createFileRoute("/resources/clients")({
  head: () => ({
    meta: [
      { title: "Client resources — hiring, scoping and managing freelance projects" },
      {
        name: "description",
        content:
          "Practical resources for hiring: write a brief that attracts good proposals, set a realistic budget, shortlist on evidence and run milestones that protect your spend.",
      },
      { property: "og:title", content: "Client resources — WorkIQHub" },
      {
        property: "og:description",
        content: "Briefs, budgets, shortlisting and milestone management.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/resources/clients" }],
  }),
  component: ClientResources,
});

function ClientResources() {
  const guides = GUIDES.filter((g) => g.audience !== "freelancers");
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Resources", to: "/resources" }, { label: "Clients" }]} />
      <PageHero
        kicker="For clients"
        title="Hire well, then run the project well"
        lead="Most freelance projects fail on scope, not on skill. These resources cover writing a brief that attracts the right people and running milestones so nobody is guessing what 'done' means."
      />

      <Section title="The hiring sequence">
        <Steps
          items={[
            "Define the outcome you need",
            "Set a real budget range",
            "Post the project or invite talent",
            "Shortlist on portfolio evidence",
            "Agree milestones and fund the first",
            "Review, approve and release",
          ]}
        />
      </Section>

      <Section title="Guides for clients">
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

      <Section title="Tools for planning a project">
        <CardGrid cols={3}>
          <InfoCard
            title="Project cost calculator"
            body="Build a defensible budget range from scope, complexity and revision rounds."
            to="/tools/project-cost-calculator"
          />
          <InfoCard
            title="Job description generator"
            body="Turn a rough need into a structured brief with scope, skills and deliverables."
            to="/tools/job-description-generator"
          />
          <InfoCard
            title="Rate calculator"
            body="Sanity-check whether a quoted rate is plausible for the work involved."
            to="/tools/rate-calculator"
          />
        </CardGrid>
      </Section>

      <Section title="Find talent now">
        <CardGrid cols={3}>
          <InfoCard
            title="Talent directory"
            body="Every published profile, filterable by category."
            to="/freelancers"
          />
          <InfoCard
            title="Browse categories"
            body="Nine categories covering the full range of freelance work."
            to="/categories"
          />
          <InfoCard
            title="Post a project"
            body="Describe the work and let matched freelancers apply."
            to="/post-a-job"
          />
        </CardGrid>
      </Section>

      <CtaRow
        primary={{ label: "Hire talent", to: "/freelancers" }}
        secondary={{ label: "Post a project", to: "/post-a-job" }}
      />
    </PageShell>
  );
}
