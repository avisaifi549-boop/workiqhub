import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, PageHero, Section, Prose, CardGrid, InfoCard } from "@/components/site/Sections";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers at WorkIQHub" },
      {
        name: "description",
        content:
          "How we work and how to reach us about working together. Open roles are listed here when they exist.",
      },
      { property: "og:title", content: "Careers at WorkIQHub" },
      { property: "og:description", content: "How we work, and how to reach us about roles." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: Careers,
});

function Careers() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Careers" }]} />
      <PageHero
        kicker="Careers"
        title="Work with us"
        lead="We are a small team building marketplace infrastructure. When we open a role it is listed on this page — we do not keep evergreen listings open to collect applications."
      />

      <Section title="Open roles">
        <div className="glass-strong rounded-2xl border border-border p-8">
          <h3 className="text-lg font-semibold">No open roles right now</h3>
          <p className="mt-2 max-w-[52ch] text-sm text-muted-foreground">
            There are no vacancies advertised at the moment. If you think you should be on our radar
            anyway, send a short note describing the work you do and a link to it.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Get in touch
          </Link>
        </div>
      </Section>

      <Section title="How we work">
        <CardGrid cols={3}>
          <InfoCard
            title="Evidence over assertion"
            body="Decisions are argued from data and user behaviour, not seniority."
          />
          <InfoCard
            title="Ship and observe"
            body="Small changes released often, measured properly, reversed without drama."
          />
          <InfoCard
            title="Write things down"
            body="Documented reasoning is how a small team stays coherent."
          />
        </CardGrid>
      </Section>

      <Section title="Working with us as a freelancer">
        <Prose>
          <p>
            We also engage independent professionals through the marketplace itself. Publishing a
            strong profile is the most direct way to be considered for that work.
          </p>
        </Prose>
        <Link
          to="/get-started"
          className="mt-6 inline-block rounded-lg glass px-5 py-3 text-sm font-semibold ring-1 ring-border"
        >
          Create a freelancer profile
        </Link>
      </Section>
    </PageShell>
  );
}
