import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Loom — building a better way to work" },
      {
        name: "description",
        content:
          "Loom connects skilled independent professionals with businesses that need great work. Our mission, the problems we set out to fix, our principles and how we think about AI.",
      },
      { property: "og:title", content: "About Loom — building a better way to work" },
      {
        property: "og:description",
        content:
          "Our mission, the problems with freelance hiring, and the principles behind the platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about-us" }],
  }),
  component: About,
});

const PRINCIPLES = [
  ["Trust", "Every signal on the platform must be earned. Nothing that implies credibility is for sale."],
  ["Transparency", "Pricing, verification and ranking rules are explained rather than hidden."],
  ["Quality", "We would rather show fewer, better profiles than pad a directory."],
  ["Opportunity", "The free tier has to be genuinely usable — good work should not require a subscription."],
  ["Innovation", "Automation should remove admin, not manufacture credibility."],
  ["Fairness", "Both sides of a project have obligations, protections and a voice in the record."],
] as const;

function About() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "About us" }]} />
      <PageHero
        kicker="About"
        title="Building a better way to work."
        lead="Loom is a marketplace for independent professionals and the businesses that hire them — designed so that reputation, payment and discovery all rest on verifiable work."
      />

      <Section title="Our mission">
        <Prose>
          <p>
            Skilled independent professionals and the businesses that need them still find each
            other inefficiently. Good work is hard to surface, credibility is hard to prove, and the
            practical parts of a project — scope, payment, approval — are spread across tools that
            were never designed for them.
          </p>
          <p>
            Our mission is to connect skilled independent professionals with businesses that need
            great work, and to make the whole engagement — discovery, agreement, delivery, payment
            and reputation — work as one coherent system.
          </p>
        </Prose>
      </Section>

      <Section title="The problem">
        <CardGrid cols={3}>
          <InfoCard
            title="Discovery is difficult"
            body="Clients scroll through interchangeable profiles with no reliable way to tell who has actually done comparable work."
          />
          <InfoCard
            title="Quality is unpredictable"
            body="Marketing language outperforms evidence, so hiring becomes a gamble rather than a judgement."
          />
          <InfoCard
            title="Communication breaks down"
            body="Briefs, decisions and files scatter across email and chat, and nobody can reconstruct what was agreed."
          />
          <InfoCard
            title="Tools are fragmented"
            body="Proposals in one place, contracts in another, invoices in a third — each handoff loses context."
          />
          <InfoCard
            title="Trust is thin"
            body="Where reviews can be bought or traded, the whole signal stops being useful to anyone."
          />
          <InfoCard
            title="Reputation is hard to build"
            body="Good freelancers restart from zero on every platform, with no way to carry proof of delivered work."
          />
        </CardGrid>
      </Section>

      <Section title="Our solution">
        <Prose>
          <p>
            Loom keeps the whole engagement in one system. Profiles are structured so they can be
            compared, not just admired. Jobs, proposals, contracts and milestones share one record,
            so scope and approval are never ambiguous.
          </p>
          <p>
            Reviews are generated only by completed projects between the two parties, and the
            platform enforces that at the data layer rather than as a policy. Verification is
            reviewed by our team and can never be purchased. AI is used to reduce work, never to
            invent credibility.
          </p>
        </Prose>
      </Section>

      <Section title="Built for freelancers">
        <CardGrid cols={3}>
          <InfoCard
            title="A profile that ranks"
            body="Public, server-rendered profile pages designed to be found — once they clear the quality bar."
          />
          <InfoCard
            title="Less admin"
            body="Proposals, contracts, milestones and payment status live in one dashboard."
          />
          <InfoCard
            title="Reputation that carries"
            body="Verified projects and two-sided reviews build a record that is hard to fake and easy to trust."
          />
        </CardGrid>
      </Section>

      <Section title="Built for businesses">
        <CardGrid cols={3}>
          <InfoCard
            title="Shortlist with evidence"
            body="Portfolios with context, verified reviews and filters that reflect how you actually choose."
          />
          <InfoCard
            title="Controlled spending"
            body="Fund one milestone at a time and release only on approval."
          />
          <InfoCard
            title="A clean record"
            body="Every state change on a project is stored, which makes disputes rare and resolvable."
          />
        </CardGrid>
      </Section>

      <Section title="Our principles">
        <CardGrid cols={3}>
          {PRINCIPLES.map(([t, b]) => (
            <InfoCard key={t} title={t} body={b} />
          ))}
        </CardGrid>
      </Section>

      <Section title="How we think about AI">
        <Prose>
          <p>
            AI should amplify human talent, not misrepresent it. Every AI feature on Loom is
            grounded in data you actually provided — your profile, your skills, your portfolio, your
            pricing.
          </p>
          <p>We do not generate, and we remove, content that fabricates:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>experience you do not have</li>
            <li>reviews or testimonials</li>
            <li>portfolio work or clients</li>
            <li>certifications or credentials</li>
            <li>results and performance claims</li>
          </ul>
        </Prose>
      </Section>

      <Section title="Our vision">
        <Prose>
          <p>
            A global professional marketplace where talented people can build sustainable careers,
            and businesses can reach the skills they need without guessing who to trust.
          </p>
        </Prose>
      </Section>

      <CtaRow
        primary={{ label: "Join as a freelancer", to: "/get-started" }}
        secondary={{ label: "Hire talent", to: "/freelancers" }}
      />
    </PageShell>
  );
}
