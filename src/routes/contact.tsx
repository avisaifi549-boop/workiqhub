import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, PageHero, Section, CardGrid, InfoCard } from "@/components/site/Sections";
import { track } from "@/lib/site/track";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Loom — support, disputes, partnerships and press" },
      {
        name: "description",
        content:
          "Reach the Loom team about client or freelancer support, payment issues, technical problems, abuse reports, partnerships or press.",
      },
      { property: "og:title", content: "Contact Loom" },
      {
        property: "og:description",
        content: "Support, payment issues, abuse reports, partnerships and press.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const REASONS = [
  "General question",
  "Client support",
  "Freelancer support",
  "Payment issue",
  "Technical problem",
  "Report abuse",
  "Partnership",
  "Press",
];

const field =
  "mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

function Contact() {
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    track("contact_submit", { reason: reason ?? "unspecified" });
    setSent(true);
    toast.success("Message prepared. We'll be in touch at the address you provided.");
  }

  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Contact" }]} />
      <PageHero
        kicker="Contact"
        title="Talk to the team"
        lead="Tell us what you need and who you are on the platform, and the message reaches the right place. For anything urgent inside a live project, raise it in the project first so the record stays complete."
      />

      <section className="grid gap-10 pb-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {sent ? (
            <div className="glass-strong rounded-2xl border border-border p-8">
              <h2 className="font-display text-2xl uppercase tracking-tight">Message received</h2>
              <p className="mt-3 text-muted-foreground">
                Thanks — your message has been logged with the reason you selected. We reply to the
                email address you provided.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 rounded-lg glass px-5 py-3 text-sm font-semibold ring-1 ring-border"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="glass-strong space-y-5 rounded-2xl border border-border p-7"
            >
              <div>
                <label htmlFor="reason" className="label-mono">
                  Contact reason
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={field}
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label-mono">
                    Name
                  </label>
                  <input id="name" name="name" required className={field} />
                </div>
                <div>
                  <label htmlFor="email" className="label-mono">
                    Email
                  </label>
                  <input id="email" name="email" type="email" required className={field} />
                </div>
              </div>

              <div>
                <label htmlFor="accountType" className="label-mono">
                  Account type
                </label>
                <select id="accountType" name="accountType" className={field}>
                  <option>Freelancer</option>
                  <option>Client</option>
                  <option>Not registered yet</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="label-mono">
                  Subject
                </label>
                <input id="subject" name="subject" required className={field} />
              </div>

              <div>
                <label htmlFor="message" className="label-mono">
                  Message
                </label>
                <textarea id="message" name="message" rows={6} required className={field} />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
              >
                Send message
              </button>
              <p className="text-xs text-muted-foreground">
                Please do not include passwords, payment card numbers or identity documents in this
                form.
              </p>
            </form>
          )}
        </div>

        <aside className="space-y-5 lg:col-span-2">
          <div className="glass rounded-2xl border border-border p-6">
            <h2 className="label-mono">Before you write</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                Most account and project questions are answered in the{" "}
                <Link to="/faqs" className="text-primary">
                  FAQs
                </Link>
                .
              </li>
              <li>
                Payment and milestone problems are usually resolved fastest through the{" "}
                <Link to="/help/disputes" className="text-primary">
                  dispute center
                </Link>
                .
              </li>
              <li>
                Safety concerns are covered on{" "}
                <Link to="/trust-and-safety" className="text-primary">
                  trust &amp; safety
                </Link>
                .
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <Section title="Other ways to get help">
        <CardGrid cols={3}>
          <InfoCard
            title="Help center"
            body="Guides for account setup, projects, payments and moderation."
            to="/help"
          />
          <InfoCard
            title="Trust & safety"
            body="How verification, review integrity and dispute handling work."
            to="/trust-and-safety"
          />
          <InfoCard
            title="Press"
            body="Media enquiries and what we can share about the platform."
            to="/press"
          />
        </CardGrid>
      </Section>
    </PageShell>
  );
}
