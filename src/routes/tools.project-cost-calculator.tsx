import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ToolShell, Field, inputClass, OutputCard } from "@/components/site/ToolShell";
import { formatInr } from "@/lib/plans";

export const Route = createFileRoute("/tools/project-cost-calculator")({
  head: () => ({
    meta: [
      { title: "Project cost calculator — budget a freelance project | Loom" },
      {
        name: "description",
        content:
          "Free project cost calculator for clients. Estimate a freelance project budget range from scope, complexity, revision rounds and contingency.",
      },
      { property: "og:title", content: "Project cost calculator — Loom" },
      {
        property: "og:description",
        content: "Estimate a realistic budget range before you post a project.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools/project-cost-calculator" }],
  }),
  component: CostCalculator,
});

const COMPLEXITY: Record<string, number> = {
  "Simple — well-defined, familiar work": 1,
  "Moderate — some unknowns or integrations": 1.35,
  "Complex — new systems, heavy integration": 1.8,
};

function CostCalculator() {
  const [hourly, setHourly] = useState(1500);
  const [days, setDays] = useState(10);
  const [complexity, setComplexity] = useState(Object.keys(COMPLEXITY)[0]!);
  const [revisions, setRevisions] = useState(2);
  const [contingency, setContingency] = useState(15);

  const base = hourly * 8 * Math.max(days, 0);
  const multiplier = COMPLEXITY[complexity] ?? 1;
  const withRevisions = base * multiplier * (1 + revisions * 0.06);
  const mid = withRevisions * (1 + contingency / 100);
  const low = Math.round(mid * 0.85);
  const high = Math.round(mid * 1.25);

  return (
    <ToolShell
      name="Project cost calculator"
      title="Project cost calculator"
      lead="A budget range built from scope rather than a guess. Use it to sanity-check quotes and to set a range on your project post that attracts serious proposals."
      form={
        <>
          <Field label="Expected freelancer hourly rate (₹)" hint="Check profiles in the category you are hiring from.">
            <input
              type="number"
              min={0}
              value={hourly}
              onChange={(e) => setHourly(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Estimated working days" hint="Full days of focused work, not calendar days.">
            <input
              type="number"
              min={0}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Complexity">
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className={inputClass}
            >
              {Object.keys(COMPLEXITY).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Revision rounds included">
            <input
              type="number"
              min={0}
              max={10}
              value={revisions}
              onChange={(e) => setRevisions(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Contingency (%)" hint="Scope always moves a little. 10–20% is normal.">
            <input
              type="number"
              min={0}
              max={60}
              value={contingency}
              onChange={(e) => setContingency(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </>
      }
      output={
        <OutputCard title="Budget range">
          <p className="font-display text-4xl text-primary">
            {formatInr(low)} – {formatInr(high)}
          </p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Base effort</dt>
              <dd className="font-medium">{formatInr(Math.round(base))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Complexity factor</dt>
              <dd className="font-medium">×{multiplier}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Midpoint</dt>
              <dd className="font-medium">{formatInr(Math.round(mid))}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-muted-foreground">
            Split this across milestones so you fund one stage at a time.
          </p>
        </OutputCard>
      }
      how={[
        "Base effort is the hourly rate × 8 hours × the working days you estimated.",
        "Complexity scales that figure, and each revision round adds a small allowance.",
        "Contingency is applied last, and the range is shown at ±15–25% around the midpoint because estimates are ranges, not points.",
      ]}
      faqs={[
        {
          q: "Should I show my budget range when posting?",
          a: "Yes. A stated range filters out mismatched proposals and gets you better-targeted applications.",
        },
        {
          q: "The range looks high — what can I cut?",
          a: "Reduce scope before reducing rate. A smaller, well-defined first milestone usually delivers more than a stretched full project.",
        },
        {
          q: "Does Loom set prices?",
          a: "No. Freelancers set their own rates, shown on their profiles.",
        },
      ]}
    />
  );
}
