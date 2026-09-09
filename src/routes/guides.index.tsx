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
import { GUIDES } from "@/lib/site/guides";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Freelance guides — hiring, pricing, proposals and delivery" },
      {
        name: "description",
        content:
          "Free, practical guides for freelancers and clients: how to hire, how to start freelancing, what to charge, how to write proposals and how to run projects.",
      },
      { property: "og:title", content: "Freelance guides — WorkIQHub" },
      {
        property: "og:description",
        content: "Hiring, pricing, portfolios, proposals and project management.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/guides" }],
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  const forFreelancers = GUIDES.filter((g) => g.audience === "freelancers");
  const forClients = GUIDES.filter((g) => g.audience === "clients");
  const forBoth = GUIDES.filter((g) => g.audience === "both");

  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Guides" }]} />
      <PageHero
        kicker="Guides"
        title="Practical guides, no filler"
        lead="Written from how freelance projects actually run on this platform: what to do, in what order, and what to avoid. Free to read, no account needed."
      />

      <Section title="For freelancers">
        <CardGrid cols={3}>
          {forFreelancers.map((g) => (
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

      <Section title="For clients">
        <CardGrid cols={3}>
          {forClients.map((g) => (
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

      <Section title="For both sides">
        <CardGrid cols={3}>
          {forBoth.map((g) => (
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

      <CtaRow
        primary={{ label: "Get started", to: "/get-started" }}
        secondary={{ label: "Free tools", to: "/tools" }}
      />
    </PageShell>
  );
}
