import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ToolShell, Field, inputClass, OutputCard } from "@/components/site/ToolShell";
import { formatInr } from "@/lib/plans";

export const Route = createFileRoute("/tools/rate-calculator")({
  head: () => ({
    meta: [
      { title: "Freelance rate calculator — work out your hourly rate | WorkIQHub" },
      {
        name: "description",
        content:
          "Free hourly rate calculator for freelancers. Enter your target income, costs, working weeks and billable hours to get a defensible hourly and day rate.",
      },
      { property: "og:title", content: "Freelance rate calculator — WorkIQHub" },
      {
        property: "og:description",
        content: "Turn target income, costs and billable hours into an hourly rate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools/rate-calculator" }],
  }),
  component: RateCalculator,
});

function RateCalculator() {
  const [income, setIncome] = useState(1200000);
  const [costs, setCosts] = useState(120000);
  const [weeks, setWeeks] = useState(46);
  const [hours, setHours] = useState(20);
  const [taxPct, setTaxPct] = useState(20);

  const billableHours = Math.max(weeks * hours, 1);
  const gross = (income + costs) / (1 - Math.min(taxPct, 90) / 100);
  const hourly = Math.round(gross / billableHours);
  const day = hourly * 8;

  return (
    <ToolShell
      name="Rate calculator"
      title="Freelance rate calculator"
      lead="Your rate is not a market average — it is arithmetic. Enter what you need to earn, what your business costs, and how many hours you can genuinely bill."
      form={
        <>
          <Field label="Target annual income (₹)" hint="What you want to take home before tax.">
            <input
              type="number"
              min={0}
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Annual business costs (₹)" hint="Software, hardware, insurance, workspace.">
            <input
              type="number"
              min={0}
              value={costs}
              onChange={(e) => setCosts(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Working weeks per year" hint="Subtract holiday, sickness and downtime.">
            <input
              type="number"
              min={1}
              max={52}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field
            label="Billable hours per week"
            hint="Admin, sales and learning are not billable. Most freelancers bill 15–25."
          >
            <input
              type="number"
              min={1}
              max={60}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Tax and contributions (%)" hint="An estimate is fine.">
            <input
              type="number"
              min={0}
              max={80}
              value={taxPct}
              onChange={(e) => setTaxPct(Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </>
      }
      output={
        <OutputCard title="Your rate">
          <p className="font-display text-5xl text-primary">{formatInr(hourly)}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">per hour</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Day rate (8h)</dt>
              <dd className="font-medium">{formatInr(day)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Billable hours / year</dt>
              <dd className="font-medium">{billableHours}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Revenue needed</dt>
              <dd className="font-medium">{formatInr(Math.round(gross))}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-muted-foreground">
            This is a floor, not a ceiling. Specialisation and proven outcomes support a higher rate.
          </p>
        </OutputCard>
      }
      how={[
        "Target income and business costs are added together, then grossed up for the tax rate you entered.",
        "That total is divided by your realistic billable hours (working weeks × billable hours per week).",
        "The result is the minimum hourly rate that covers your costs and income target — before any premium for expertise.",
      ]}
      faqs={[
        {
          q: "Why are my billable hours so much lower than my working hours?",
          a: "Sales, admin, invoicing, learning and unpaid revisions all take time you cannot bill. Treating a 40-hour week as 40 billable hours is the most common freelance pricing error.",
        },
        {
          q: "Should I quote hourly or fixed price?",
          a: "Use this hourly figure as the basis for fixed quotes too: estimate the hours, add contingency, then present a fixed price.",
        },
        {
          q: "Is my data saved?",
          a: "No. The calculation runs in your browser and nothing is transmitted or stored.",
        },
      ]}
    />
  );
}
