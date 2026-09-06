import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/freelancers", label: "Talent" },
  { to: "/jobs", label: "Jobs" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function SiteHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-xl tracking-wide">
            LOOM<span className="text-primary">.</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-foreground" }}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
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
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-lg glass px-4 py-2 text-sm font-medium ring-1 ring-border transition-colors hover:text-primary"
              >
                Open account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
