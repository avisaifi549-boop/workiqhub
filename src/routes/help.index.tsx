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

export const Route = createFileRoute("/help/")({
  head: () => ({
    meta: [
      { title: "Help Center — Loom" },
      {
        name: "description",
        content:
          "Get help with your Loom account, projects, milestones, payments, reviews, verification and moderation, or contact support directly.",
      },
      { property: "og:title", content: "Help Center — Loom" },
      {
        property: "og:description",
        content: "Account, projects, payments, reviews, verification and moderation help.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/help" }],
  }),
  component: Help,
});

function Help() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Help center" }]} />
      <PageHero
        kicker="Support"
        title="Help center"
        lead="Start here for account setup, running a project, payments and moderation. Anything not covered can go straight to support."
      />

      <Section title="Getting started">
        <CardGrid cols={3}>
          <InfoCard
            title="Create an account"
            body="Choose whether you are hiring or freelancing, then complete the onboarding for that role."
            to="/get-started"
          />
          <InfoCard
            title="Build your freelancer profile"
            body="What the profile strength score measures and how to move it honestly."
            to="/guides/how-to-build-a-strong-profile"
          />
          <InfoCard
            title="Hire your first freelancer"
            body="From a vague need to a funded, well-scoped project."
            to="/guides/how-to-hire-a-freelancer"
          />
        </CardGrid>
      </Section>

      <Section title="Projects and payments">
        <CardGrid cols={3}>
          <InfoCard
            title="How milestones work"
            body="Funding, submission, revision, approval and release, step by step."
            to="/faqs"
          />
          <InfoCard
            title="Managing a project"
            body="Scope, communication rhythm and closing out cleanly."
            to="/guides/how-to-manage-a-freelance-project"
          />
          <InfoCard
            title="Dispute center"
            body="What to do when a milestone cannot be agreed."
            to="/help/disputes"
          />
        </CardGrid>
      </Section>

      <Section title="Trust, safety and account">
        <CardGrid cols={3}>
          <InfoCard
            title="Verification"
            body="Identity, skill and top talent review — and why it cannot be bought."
            to="/trust-and-safety"
          />
          <InfoCard
            title="Reporting and blocking"
            body="How to report a profile, job, message or review."
            to="/trust-and-safety"
          />
          <InfoCard
            title="Privacy and your data"
            body="What is public on your profile and what never is."
            to="/privacy"
          />
        </CardGrid>
      </Section>

      <CtaRow
        primary={{ label: "Contact support", to: "/contact" }}
        secondary={{ label: "Browse FAQs", to: "/faqs" }}
      />
    </PageShell>
  );
}
