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
import { FREE_TOOLS } from "@/lib/site/nav";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: "Resources — guides, tools and help for freelancers and clients" },
      {
        name: "description",
        content:
          "Practical guides on hiring and freelancing, free calculators and generators, plus help and FAQs — everything needed to run better freelance projects.",
      },
      { property: "og:title", content: "Resources — WorkIQHub" },
      {
        property: "og:description",
        content: "Guides, free tools and help for freelancers and clients.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: Resources,
});

function Resources() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Resources" }]} />
      <PageHero
        kicker="Resources"
        title="Everything you need to work better"
        lead="Guides written from how the marketplace actually works, free tools that do real arithmetic, and help when something goes wrong."
      />

      <Section title="Start here">
        <CardGrid cols={2}>
          <InfoCard
            meta="For clients"
            title="Client resources"
            body="Hiring, scoping, budgets, milestone management and closing out a project well."
            to="/resources/clients"
          />
          <InfoCard
            meta="For freelancers"
            title="Freelancer resources"
            body="Profiles, pricing, proposals, delivery and turning projects into repeat work."
            to="/resources/freelancers"
          />
        </CardGrid>
      </Section>

      <Section title="Guides" lead="Long-form, practical, and free to read.">
        <CardGrid cols={3}>
          {GUIDES.slice(0, 6).map((g) => (
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

      <Section title="Free tools" lead="No account required.">
        <CardGrid cols={3}>
          {FREE_TOOLS.map((t) => (
            <InfoCard
              key={t.to}
              title={t.label}
              body="Runs in your browser — nothing you enter is stored."
              to={t.to}
            />
          ))}
        </CardGrid>
      </Section>

      <Section title="Help and answers">
        <CardGrid cols={3}>
          <InfoCard title="FAQs" body="Short answers about how the platform works." to="/faqs" />
          <InfoCard
            title="Help center"
            body="Account, project, payment and moderation help."
            to="/help"
          />
          <InfoCard
            title="Trust & safety"
            body="Verification, review integrity and dispute handling."
            to="/trust-and-safety"
          />
        </CardGrid>
      </Section>

      <CtaRow
        primary={{ label: "Get started", to: "/get-started" }}
        secondary={{ label: "Browse talent", to: "/freelancers" }}
      />
    </PageShell>
  );
}
