import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -top-40 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-primary/8 blur-[130px]" />
      <SiteHeader />
      <main className="relative mx-auto max-w-7xl px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
      ({index}) — {children}
    </p>
  );
}
