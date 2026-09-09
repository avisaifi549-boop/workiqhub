import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ToolShell, Field, inputClass, OutputCard } from "@/components/site/ToolShell";

export const Route = createFileRoute("/tools/profile-score")({
  head: () => ({
    meta: [
      { title: "Freelancer profile score — check your profile strength | WorkIQHub" },
      {
        name: "description",
        content:
          "Score a freelancer profile draft against the completeness checks that matter: headline, bio, skills, portfolio, pricing, availability and credentials.",
      },
      { property: "og:title", content: "Freelancer profile score — WorkIQHub" },
      {
        property: "og:description",
        content: "Check profile completeness and see exactly what to fix next.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools/profile-score" }],
  }),
  component: ProfileScore,
});

function ProfileScore() {
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState(0);
  const [portfolio, setPortfolio] = useState(0);
  const [services, setServices] = useState(0);
  const [hasPricing, setHasPricing] = useState(false);
  const [hasAvailability, setHasAvailability] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);

  const checks = [
    { label: "Photo added", points: 8, ok: hasPhoto },
    { label: "Headline of at least 30 characters", points: 12, ok: headline.trim().length >= 30 },
    { label: "Bio of at least 200 characters", points: 16, ok: bio.trim().length >= 200 },
    { label: "At least 5 skills listed", points: 12, ok: skills >= 5 },
    { label: "At least 2 portfolio pieces", points: 20, ok: portfolio >= 2 },
    { label: "At least 1 published service", points: 10, ok: services >= 1 },
    { label: "Pricing set", points: 10, ok: hasPricing },
    { label: "Availability set", points: 6, ok: hasAvailability },
    { label: "Education or certifications added", points: 6, ok: hasCredentials },
  ];

  const score = checks.reduce((n, c) => n + (c.ok ? c.points : 0), 0);
  const missing = checks.filter((c) => !c.ok);

  return (
    <ToolShell
      name="Profile score"
      title="Freelancer profile score"
      lead="A profile is judged on completeness and evidence, not adjectives. Score a draft here before you publish, and see exactly which gap costs you the most."
      form={
        <>
          <Field label="Headline" hint="Name your discipline and the context you work in.">
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Bio" hint="How you work, who you work with, what you have delivered.">
            <textarea
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Skills listed">
              <input
                type="number"
                min={0}
                value={skills}
                onChange={(e) => setSkills(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
            <Field label="Portfolio pieces">
              <input
                type="number"
                min={0}
                value={portfolio}
                onChange={(e) => setPortfolio(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
            <Field label="Published services">
              <input
                type="number"
                min={0}
                value={services}
                onChange={(e) => setServices(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          </div>
          <fieldset className="space-y-3">
            <legend className="label-mono">Also completed</legend>
            {[
              ["Profile photo", hasPhoto, setHasPhoto] as const,
              ["Pricing set", hasPricing, setHasPricing] as const,
              ["Availability set", hasAvailability, setHasAvailability] as const,
              ["Education or certifications", hasCredentials, setHasCredentials] as const,
            ].map(([label, value, set]) => (
              <label key={label} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => set(e.target.checked)}
                  className="size-4"
                />
                {label}
              </label>
            ))}
          </fieldset>
        </>
      }
      output={
        <OutputCard title="Profile strength">
          <p className="font-display text-5xl text-primary">{score}/100</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-accent/60">
            <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {score >= 70
              ? "Strong enough to publish. Keep adding portfolio evidence as projects complete."
              : "Not ready to publish yet — the gaps below are what to fix first."}
          </p>
          {missing.length > 0 && (
            <ul className="mt-5 space-y-2 text-sm">
              {missing
                .sort((a, b) => b.points - a.points)
                .map((c) => (
                  <li key={c.label} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-mono text-xs text-primary">+{c.points}</span>
                  </li>
                ))}
            </ul>
          )}
        </OutputCard>
      }
      how={[
        "Each check carries a weight based on how much it affects a client's ability to judge you.",
        "Portfolio evidence and bio depth carry the most weight; badges and adjectives carry none.",
        "On the platform, the same idea runs against your saved profile and decides whether it gets a public, indexable page.",
      ]}
      faqs={[
        {
          q: "Does a paid plan raise my score?",
          a: "No. Profile strength measures completeness and evidence only. No subscription changes it.",
        },
        {
          q: "Why does an incomplete profile stay unlisted?",
          a: "Thin profiles make the whole directory less useful and perform badly in search. Publishing only complete profiles protects everyone listed.",
        },
      ]}
    >
      <section className="border-t border-border py-12">
        <h2 className="font-display text-3xl uppercase tracking-tight">Fix it on your profile</h2>
        <p className="mt-3 max-w-[56ch] text-muted-foreground">
          Signed in, the same checks run against your real profile and link straight to the section
          that needs work.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/get-started"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Create your profile
          </Link>
          <Link
            to="/guides/$slug"
            params={{ slug: "how-to-build-a-strong-profile" }}
            className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border"
          >
            Read the profile guide
          </Link>
        </div>
      </section>
    </ToolShell>
  );
}
