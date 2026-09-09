import { Link } from "@tanstack/react-router";
import { FOOTER_COLUMNS } from "@/lib/site/nav";
import { CATEGORY_GROUPS } from "@/lib/site/categories";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <Link to="/" className="font-display text-xl tracking-wide">
              LOOM<span className="text-primary">.</span>
            </Link>
            <p className="mt-3 max-w-[26ch] text-sm text-muted-foreground">
              A marketplace for independent professionals and the businesses that hire them.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="label-mono">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <h2 className="label-mono">Browse by category</h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {CATEGORY_GROUPS.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/categories/$slug"
                  params={{ slug: c.slug }}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            © {year} WorkIQHub. Built for independent professionals.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-5">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link
              to="/trust-and-safety"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Trust &amp; safety
            </Link>
            <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
