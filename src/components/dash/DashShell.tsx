import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";

type NavItem = { to: string; label: string };

const FREELANCER_NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/jobs", label: "Find jobs" },
  { to: "/applications", label: "My applications" },
  { to: "/projects", label: "My projects" },
  { to: "/services", label: "My services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/reviews", label: "Reviews" },
  { to: "/profile", label: "Profile" },
];

const CLIENT_NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/post-a-job", label: "Post a project" },
  { to: "/freelancers", label: "Find freelancers" },
  { to: "/my-jobs", label: "My jobs & applicants" },
  { to: "/projects", label: "My projects" },
  { to: "/reviews", label: "Reviews" },
  { to: "/profile", label: "Profile" },
];

export function DashShell({
  role,
  title,
  subtitle,
  actions,
  children,
}: {
  role: "freelancer" | "client";
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const nav = role === "client" ? CLIENT_NAV : FREELANCER_NAV;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -top-40 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
      <SiteHeader />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-primary/15 text-primary" }}
                className="shrink-0 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl uppercase tracking-tight sm:text-4xl">
                {title}
              </h1>
              {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
          </div>
          <div className="mt-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string | undefined;
}) {
  return (
    <div className="glass rounded-xl border border-border p-4">
      <p className="label-mono">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
