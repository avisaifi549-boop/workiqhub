import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { track } from "@/lib/site/track";
import {
  HIRE_BY_CATEGORY,
  POPULAR_TALENT,
  HIRE_FOR_PROJECT,
  WORK_BY_CATEGORY,
  POPULAR_OPPORTUNITIES,
  FREELANCER_RESOURCES,
  RESOURCE_LINKS,
  POPULAR_GUIDES,
  FREE_TOOLS,
  type NavLink,
} from "@/lib/site/nav";

type MenuId = "hire" | "work" | "resources";

function LinkList({ items, onNavigate }: { items: NavLink[]; onNavigate: () => void }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li key={`${item.label}-${item.to}`}>
          <Link
            to={item.to}
            onClick={() => {
              track("nav_click", { label: item.label, to: item.to });
              onNavigate();
            }}
            className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="label-mono">{children}</h2>;
}

function MegaPanel({ id, close }: { id: MenuId; close: () => void }) {
  return (
    <div
      id={`megamenu-${id}`}
      className="absolute inset-x-0 top-full z-40 hidden border-b border-border glass-strong md:block"
    >
      <div className="mx-auto max-w-7xl px-6 py-8">
        {id === "hire" && (
          <div className="grid gap-8 lg:grid-cols-4">
            <div>
              <ColumnTitle>Hire by category</ColumnTitle>
              <LinkList items={HIRE_BY_CATEGORY} onNavigate={close} />
            </div>
            <div className="lg:col-span-2">
              <ColumnTitle>Popular talent</ColumnTitle>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                {POPULAR_TALENT.map((item) => (
                  <li key={item.to + item.label}>
                    <Link
                      to={item.to}
                      onClick={() => {
                        track("nav_click", { label: item.label, to: item.to });
                        close();
                      }}
                      className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ColumnTitle>Hire for your project</ColumnTitle>
              <LinkList items={HIRE_FOR_PROJECT} onNavigate={close} />
            </div>
          </div>
        )}

        {id === "work" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <ColumnTitle>Find freelance work</ColumnTitle>
              <LinkList items={WORK_BY_CATEGORY} onNavigate={close} />
            </div>
            <div>
              <ColumnTitle>Popular opportunities</ColumnTitle>
              <LinkList items={POPULAR_OPPORTUNITIES} onNavigate={close} />
            </div>
            <div>
              <ColumnTitle>Freelancer resources</ColumnTitle>
              <LinkList items={FREELANCER_RESOURCES} onNavigate={close} />
            </div>
          </div>
        )}

        {id === "resources" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <ColumnTitle>Resources</ColumnTitle>
              <LinkList items={RESOURCE_LINKS} onNavigate={close} />
            </div>
            <div>
              <ColumnTitle>Popular guides</ColumnTitle>
              <LinkList items={POPULAR_GUIDES} onNavigate={close} />
            </div>
            <div>
              <ColumnTitle>Free tools</ColumnTitle>
              <LinkList items={FREE_TOOLS} onNavigate={close} />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
          {id === "hire" && (
            <>
              <Link
                to="/freelancers"
                onClick={close}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Find the right freelancer
              </Link>
              <Link
                to="/post-a-job"
                onClick={close}
                className="rounded-lg glass px-5 py-2.5 text-sm font-semibold ring-1 ring-border"
              >
                Post a project
              </Link>
            </>
          )}
          {id === "work" && (
            <>
              <Link
                to="/jobs"
                onClick={close}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Browse all jobs
              </Link>
              <Link
                to="/get-started"
                onClick={close}
                className="rounded-lg glass px-5 py-2.5 text-sm font-semibold ring-1 ring-border"
              >
                Start freelancing
              </Link>
            </>
          )}
          {id === "resources" && (
            <Link
              to="/resources"
              onClick={close}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Explore resources
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileAccordion({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavLink[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left text-base font-medium"
      >
        {title}
        <span aria-hidden className="text-muted-foreground">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <ul className="pb-4">
          {items.map((item) => (
            <li key={item.to + item.label}>
              <Link
                to={item.to}
                onClick={() => {
                  track("nav_click", { label: item.label, to: item.to, surface: "mobile" });
                  onNavigate();
                }}
                className="block py-2 text-sm text-muted-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SiteHeader() {
  const { user, loading } = useAuth();
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (!headerRef.current?.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  function toggle(id: MenuId) {
    setOpenMenu((cur) => {
      const next = cur === id ? null : id;
      if (next) track("megamenu_open", { menu: id });
      return next;
    });
  }

  const trigger = (id: MenuId, label: string) => (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-expanded={openMenu === id}
      aria-controls={`megamenu-${id}`}
      className={
        openMenu === id
          ? "rounded-md px-3 py-2 text-sm font-medium text-foreground"
          : "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      {label}
    </button>
  );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-border glass-strong"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpenMenu(null);
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-display text-xl tracking-wide">
            LOOM<span className="text-primary">.</span>
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {trigger("hire", "Hire Talent")}
            {trigger("work", "Find Work")}
            {trigger("resources", "Resources")}
            <Link
              to="/why-us"
              activeProps={{ className: "text-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Why Us
            </Link>
            <Link
              to="/about-us"
              activeProps={{ className: "text-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About Us
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            aria-label="Search the marketplace"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Search
          </Link>
          {loading ? null : user ? (
            <Link
              to="/dashboard"
              className="rounded-lg glass px-4 py-2 text-sm font-medium ring-1 ring-border transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "signin" }}
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Log in
              </Link>
              <Link
                to="/get-started"
                onClick={() => track("get_started_click", { surface: "header" })}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started
              </Link>
            </>
          )}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg px-3 py-2 text-sm ring-1 ring-border md:hidden"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {openMenu && <MegaPanel id={openMenu} close={() => setOpenMenu(null)} />}

      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-6 pb-8">
            <MobileAccordion
              title="Hire Talent"
              items={[...HIRE_BY_CATEGORY, { label: "All talent", to: "/freelancers" }]}
              onNavigate={() => setMobileOpen(false)}
            />
            <MobileAccordion
              title="Find Work"
              items={[...WORK_BY_CATEGORY, { label: "All jobs", to: "/jobs" }]}
              onNavigate={() => setMobileOpen(false)}
            />
            <MobileAccordion
              title="Resources"
              items={RESOURCE_LINKS}
              onNavigate={() => setMobileOpen(false)}
            />
            <MobileAccordion
              title="Free tools"
              items={FREE_TOOLS}
              onNavigate={() => setMobileOpen(false)}
            />
            <nav aria-label="Mobile pages" className="mt-2 flex flex-col">
              <Link to="/why-us" className="border-b border-border py-4 text-base font-medium">
                Why Us
              </Link>
              <Link to="/about-us" className="border-b border-border py-4 text-base font-medium">
                About Us
              </Link>
              <Link to="/faqs" className="border-b border-border py-4 text-base font-medium">
                FAQs
              </Link>
              <Link to="/search" className="border-b border-border py-4 text-base font-medium">
                Search
              </Link>
            </nav>
            {!user && (
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/auth"
                  search={{ mode: "signin" }}
                  className="rounded-lg glass px-5 py-3 text-center font-semibold ring-1 ring-border"
                >
                  Log in
                </Link>
                <Link
                  to="/get-started"
                  onClick={() => track("get_started_click", { surface: "mobile" })}
                  className="rounded-lg bg-primary px-5 py-3 text-center font-semibold text-primary-foreground"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
