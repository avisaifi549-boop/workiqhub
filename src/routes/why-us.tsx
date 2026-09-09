import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/why-us")({
  head: () => ({
    meta: [
      { title: "Why WorkIQHub — a marketplace built on verified work" },
      {
        name: "description",
        content:
          "Why WorkIQHub exists: verified reputation, milestone-protected payments, AI that works from your real profile, and a search experience that rewards evidence over marketing.",
      },
      { property: "og:title", content: "Why WorkIQHub — a marketplace built on verified work" },
      {
        property: "og:description",
        content:
          "Verified reputation, milestone-protected payments and AI that never invents experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/why-us" }],
  }),
  component: WhyUs,
});

const FREELANCER_POINTS = [
  ["More opportunities", "Open projects across every category, in one board you can filter."],
  ["Better visibility", "A public profile page built to be found in search, not buried in a directory."],
  ["AI-powered tools", "Drafting help for proposals and profiles, generated from your real work."],
  ["Professional profiles", "Skills, pricing, availability and credentials in a structure clients can compare."],
  ["Portfolio showcase", "Case-style pieces, with marketplace projects marked as verified."],
  ["Verified reputation", "Reviews only exist after completed projects — so yours mean something."],
  ["Analytics", "See how your profile and applications actually perform."],
  ["Direct client opportunities", "Clients can search, shortlist and invite you without a job post."],
] as const;

const CLIENT_POINTS = [
  ["Find relevant talent faster", "Filter by category, skills, price, availability and verification."],
  ["Search verified freelancers", "Verification is reviewed by our team, never sold."],
  ["Compare portfolios", "Judge real work with context, not thumbnails."],
  ["AI-powered matching", "Jobs and profiles are scored against real skills and history."],
  ["Secure project workflows", "Contracts and milestones with an auditable state history."],
  ["Transparent reviews", "Two-sided reviews, each tied to a completed project."],
  ["Milestone-based management", "Fund, review, approve and release, one stage at a time."],
] as const;

const TRUST = [
  ["Identity verification", "Reviewed by our team before an identity badge appears."],
  ["Skill verification", "Evidence-based review of claimed expertise."],
  ["Verified projects", "Portfolio work completed through WorkIQHub is linked to a real contract."],
  ["Verified reviews", "A review cannot exist without a completed project between the two parties."],
  ["Secure communication", "Project conversation stays inside the workspace with the project record."],
  ["Fraud prevention", "Duplicate account and spam detection, plus reporting on every surface."],
  ["Dispute handling", "A defined path when a milestone cannot be agreed."],
] as const;

const AI = [
  ["AI job matching", "Open jobs scored against your real skills, portfolio and pricing — with the reasons shown."],
  ["AI freelancer matching", "Client shortlists built from profile evidence, not paid placement."],
  ["AI proposal assistance", "Drafts written from your actual profile and past work."],
  ["AI profile optimisation", "Specific, actionable gaps in your profile — not a vanity score."],
  ["AI pricing assistance", "Rate guidance from your costs, capacity and category."],
] as const;

function WhyUs() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Why us" }]} />
      <PageHero
        kicker="Why WorkIQHub"
        title="Work should be easier to find, hire and deliver."
        lead="WorkIQHub is a marketplace for independent professionals and the businesses that hire them. Everything here is built around one idea: reputation should come from real, completed work — and nothing on the platform should let anyone fake it."
        actions={
          <>
            <Link
              to="/freelancers"
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              Hire talent
            </Link>
            <Link
              to="/get-started"
              className="rounded-lg glass px-6 py-3 font-semibold ring-1 ring-border"
            >
              Start freelancing
            </Link>
          </>
        }
      />

      <Section
        title="For freelancers"
        lead="A profile that earns attention, tools that reduce admin, and a reputation that compounds."
      >
        <CardGrid cols={4}>
          {FREELANCER_POINTS.map(([t, b]) => (
            <InfoCard key={t} title={t} body={b} />
          ))}
        </CardGrid>
      </Section>

      <Section
        title="For clients"
        lead="Shortlist on evidence, then run the project through a workflow that protects both sides."
      >
        <CardGrid cols={4}>
          {CLIENT_POINTS.map(([t, b]) => (
            <InfoCard key={t} title={t} body={b} />
          ))}
        </CardGrid>
      </Section>

      <Section
        title="Trust"
        lead="Trust is a set of mechanisms, not a promise. These are the ones we operate."
      >
        <CardGrid cols={4}>
          {TRUST.map(([t, b]) => (
            <InfoCard key={t} title={t} body={b} />
          ))}
        </CardGrid>
      </Section>

      <Section
        title="An AI-native marketplace"
        lead="AI here is grounded in your real data. It will not invent experience, clients, results or reviews — and content that does is removed."
      >
        <CardGrid cols={3}>
          {AI.map(([t, b]) => (
            <InfoCard key={t} title={t} body={b} />
          ))}
        </CardGrid>
      </Section>

      <Section title="How it works">
        <h3 className="label-mono">For clients</h3>
        <div className="mt-4">
          <Steps
            items={[
              "Post your project",
              "Discover matched talent",
              "Shortlist and interview",
              "Hire and agree milestones",
              "Collaborate in the workspace",
              "Approve and complete",
              "Review each other",
            ]}
          />
        </div>
        <h3 className="label-mono mt-10">For freelancers</h3>
        <div className="mt-4">
          <Steps
            items={[
              "Create your profile",
              "Discover matched jobs",
              "Apply with a proposal",
              "Get hired",
              "Deliver the milestone",
              "Get paid on approval",
              "Build verified reputation",
            ]}
          />
        </div>
      </Section>

      <CtaRow
        primary={{ label: "Hire talent", to: "/freelancers" }}
        secondary={{ label: "Start freelancing", to: "/get-started" }}
      />
    </PageShell>
  );
}
