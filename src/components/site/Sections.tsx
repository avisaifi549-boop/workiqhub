import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function Breadcrumbs({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="pt-8">
      <ol className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
        </li>
        {trail.map((c) => (
          <li key={c.label} className="flex gap-2">
            <span aria-hidden>/</span>
            {c.to ? (
              <Link to={c.to} className="hover:text-primary">
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  kicker,
  title,
  lead,
  actions,
}: {
  kicker: string;
  title: string;
  lead: string;
  actions?: ReactNode;
}) {
  return (
    <section className="py-12 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{kicker}</p>
      <h1 className="mt-5 max-w-[20ch] font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-[62ch] text-lg text-pretty text-muted-foreground">{lead}</p>
      {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
    </section>
  );
}

export function Section({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="font-display text-3xl uppercase tracking-tight">{title}</h2>
      {lead && <p className="mt-3 max-w-[62ch] text-muted-foreground">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function CardGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const cls =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return <div className={`grid gap-5 ${cls}`}>{children}</div>;
}

export function InfoCard({
  title,
  body,
  to,
  meta,
}: {
  title: string;
  body: string;
  to?: string;
  meta?: string;
}) {
  const inner = (
    <>
      {meta && <p className="label-mono">{meta}</p>}
      <h3 className="mt-2 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </>
  );
  const className =
    "glass block h-full rounded-2xl border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50";
  return to ? (
    <Link to={to} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

export function Steps({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <li key={s} className="glass rounded-xl border border-border p-4">
          <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
          <p className="mt-2 text-sm font-medium">{s}</p>
        </li>
      ))}
    </ol>
  );
}

export function CtaRow({
  primary,
  secondary,
}: {
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="border-t border-border py-14">
      <div className="glass-strong rounded-2xl border border-border p-8 sm:p-10">
        <h2 className="font-display text-3xl uppercase tracking-tight">Ready when you are</h2>
        <p className="mt-3 max-w-[52ch] text-muted-foreground">
          Create a free account and pick the side you are on. Everything else is set up from there.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to={primary.to}
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
          >
            {primary.label}
          </Link>
          {secondary && (
            <Link
              to={secondary.to}
              className="rounded-lg glass px-6 py-3 font-semibold ring-1 ring-border transition-all hover:-translate-y-0.5"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.q ?? null);
  return (
    <div className="divide-y divide-border rounded-2xl border border-border">
      {items.map((item) => {
        const isOpen = open === item.q;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : item.q)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
              >
                {item.q}
                <span aria-hidden className="text-muted-foreground">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            {isOpen && <p className="px-5 pb-5 text-sm text-muted-foreground">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-[70ch] space-y-4 text-muted-foreground">{children}</div>;
}
