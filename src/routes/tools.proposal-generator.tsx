import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ToolShell, Field, inputClass, OutputCard, CopyButton } from "@/components/site/ToolShell";

export const Route = createFileRoute("/tools/proposal-generator")({
  head: () => ({
    meta: [
      { title: "Freelance proposal generator — structure a winning pitch | WorkIQHub" },
      {
        name: "description",
        content:
          "Free proposal generator for freelancers. Turn the client's brief, your approach and one piece of real evidence into a short, structured proposal.",
      },
      { property: "og:title", content: "Freelance proposal generator — WorkIQHub" },
      {
        property: "og:description",
        content: "A structured proposal built from your own real experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools/proposal-generator" }],
  }),
  component: ProposalGenerator,
});

function ProposalGenerator() {
  const [client, setClient] = useState("");
  const [problem, setProblem] = useState("");
  const [approach, setApproach] = useState("");
  const [evidence, setEvidence] = useState("");
  const [price, setPrice] = useState("");
  const [timeline, setTimeline] = useState("");
  const [question, setQuestion] = useState("");

  const greeting = client.trim() ? `Hi ${client.trim()},` : "Hi,";
  const steps = approach
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const proposal = [
    greeting,
    "",
    problem.trim()
      ? `As I read it, the goal is: ${problem.trim()}`
      : "As I read it, the goal is: [restate the client's problem in one sentence].",
    "",
    "How I'd approach it:",
    ...(steps.length
      ? steps.map((s, i) => `${i + 1}. ${s}`)
      : ["1. [First step]", "2. [Second step]", "3. [Third step]"]),
    "",
    evidence.trim()
      ? `Relevant work: ${evidence.trim()}`
      : "Relevant work: [link one piece of your own work that matches this problem]",
    "",
    `Price: ${price.trim() || "[your price]"} · Timeline: ${timeline.trim() || "[your timeline]"}`,
    "",
    question.trim()
      ? `One question before I start: ${question.trim()}`
      : "One question before I start: [ask something specific about their brief]",
    "",
    "Happy to walk through any of this.",
  ].join("\n");

  return (
    <ToolShell
      name="Proposal generator"
      title="Proposal generator"
      lead="A proposal answers three questions: can you do it, are you easy to work with, and is the price believable. This lays your answers out in that order — using only work you have actually done."
      form={
        <>
          <Field label="Client name (optional)">
            <input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Their problem, in your words" hint="One sentence. Shows you read the brief.">
            <textarea
              rows={2}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Your approach" hint="One step per line. Two or three is plenty.">
            <textarea
              rows={4}
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            label="Evidence"
            hint="A real project of yours and a link. Never cite work you did not do."
          >
            <input
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Price">
              <input value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Timeline">
              <input
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Your clarifying question">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={inputClass}
            />
          </Field>
        </>
      }
      output={
        <OutputCard title="Your proposal">
          <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
            {proposal}
          </pre>
          <CopyButton text={proposal} />
        </OutputCard>
      }
      how={[
        "The generator arranges what you enter into a proven structure — it does not write claims for you.",
        "Anything you leave blank appears as a bracketed placeholder so you can see what is missing.",
        "Inside the platform, proposal assistance can draft from your saved profile and portfolio instead.",
      ]}
      faqs={[
        {
          q: "Will this write my experience for me?",
          a: "No, deliberately. Fabricated experience is the fastest way to lose a client's trust, and on WorkIQHub it is grounds for removal.",
        },
        {
          q: "How long should a proposal be?",
          a: "Short enough to read in under a minute. Detail belongs in your profile and in the conversation that follows.",
        },
        {
          q: "Does it save my drafts?",
          a: "No. Nothing entered here is stored or transmitted.",
        },
      ]}
    />
  );
}
