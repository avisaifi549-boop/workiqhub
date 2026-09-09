import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ToolShell, Field, inputClass, OutputCard, CopyButton } from "@/components/site/ToolShell";

export const Route = createFileRoute("/tools/job-description-generator")({
  head: () => ({
    meta: [
      { title: "Job description generator for freelance projects | WorkIQHub" },
      {
        name: "description",
        content:
          "Free job description generator for clients. Turn a rough need into a structured freelance brief with scope, deliverables, skills, budget and timeline.",
      },
      { property: "og:title", content: "Job description generator — WorkIQHub" },
      {
        property: "og:description",
        content: "Turn a rough need into a brief that attracts serious proposals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools/job-description-generator" }],
  }),
  component: JobDescriptionGenerator,
});

function JobDescriptionGenerator() {
  const [role, setRole] = useState("");
  const [outcome, setOutcome] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [experience, setExperience] = useState("Intermediate");

  const lines = (v: string) =>
    v
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const brief = [
    `# ${role.trim() || "[Role]"} needed — ${outcome.trim() || "[the outcome you need]"}`,
    "",
    "## About the project",
    outcome.trim()
      ? `We need ${outcome.trim()}. This project is considered successful when that is delivered and working.`
      : "[Describe the result you need and how you will judge that it has been achieved.]",
    "",
    "## Deliverables",
    ...(lines(deliverables).length
      ? lines(deliverables).map((d) => `- ${d}`)
      : ["- [First deliverable]", "- [Second deliverable]"]),
    "",
    "## Skills required",
    skills.trim() || "[List the skills that genuinely matter for this work]",
    "",
    "## Experience level",
    experience,
    "",
    "## Budget and timeline",
    `Budget: ${budget.trim() || "[range]"}`,
    `Timeline: ${timeline.trim() || "[expected duration]"}`,
    "",
    "## How we'll work",
    "The project will be split into milestones. Each milestone is funded before work begins on it, reviewed on submission, and paid on approval.",
    "",
    "## What to include in your proposal",
    "- One line on how you read the problem",
    "- Your approach in two or three steps",
    "- One relevant piece of your own work",
    "- Your price and timeline",
  ].join("\n");

  return (
    <ToolShell
      name="Job description generator"
      title="Job description generator"
      lead="Vague briefs attract vague proposals. This turns what you know into a structured project description with scope, deliverables and a budget range."
      form={
        <>
          <Field label="Role you need" hint="e.g. React developer, brand designer, SEO specialist.">
            <input value={role} onChange={(e) => setRole(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Outcome" hint="What must be true when the project is finished?">
            <textarea
              rows={2}
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Deliverables" hint="One per line.">
            <textarea
              rows={4}
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Skills required">
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Experience level">
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={inputClass}
            >
              <option>Entry</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Budget range">
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Timeline">
              <input
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </>
      }
      output={
        <OutputCard title="Your brief">
          <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
            {brief}
          </pre>
          <CopyButton text={brief} />
        </OutputCard>
      }
      how={[
        "Your answers are arranged into the sections freelancers look for: outcome, deliverables, skills, budget and process.",
        "Blanks appear as bracketed placeholders so gaps in the brief are visible before you post it.",
        "Paste the result into a new project post and edit freely.",
      ]}
      faqs={[
        {
          q: "Should I include a budget?",
          a: "Yes. A stated range gets you better-matched proposals and fewer wasted conversations.",
        },
        {
          q: "How specific should deliverables be?",
          a: "Specific enough that both sides can agree whether one has been met. That is what makes milestone approval simple.",
        },
      ]}
    />
  );
}
