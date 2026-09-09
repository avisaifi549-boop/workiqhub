import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell } from "./PageShell";
import { Breadcrumbs, Section, FaqList } from "./Sections";

export const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="label-mono">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function ToolShell({
  name,
  title,
  lead,
  form,
  output,
  how,
  faqs,
  children,
}: {
  name: string;
  title: string;
  lead: string;
  form: ReactNode;
  output: ReactNode;
  how: string[];
  faqs: { q: string; a: string }[];
  children?: ReactNode;
}) {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Tools", to: "/tools" }, { label: name }]} />
      <section className="py-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Free tool</p>
        <h1 className="mt-5 max-w-[22ch] font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg text-muted-foreground">{lead}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Runs in your browser · nothing is stored · no account needed
        </p>
      </section>

      <section className="grid gap-6 pb-6 lg:grid-cols-5">
        <div className="glass-strong space-y-5 rounded-2xl border border-border p-7 lg:col-span-3">
          {form}
        </div>
        <div className="lg:col-span-2">{output}</div>
      </section>

      {children}

      <Section title="How this works">
        <ul className="max-w-[70ch] list-disc space-y-2 pl-5 text-muted-foreground">
          {how.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </Section>

      <Section title="Questions">
        <FaqList items={faqs} />
      </Section>

      <Section title="Next step">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/get-started"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Create a free account
          </Link>
          <Link to="/tools" className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border">
            All free tools
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}

export function OutputCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="glass sticky top-24 rounded-2xl border border-border p-7">
      <h2 className="label-mono">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text);
      }}
      className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
    >
      Copy to clipboard
    </button>
  );
}
