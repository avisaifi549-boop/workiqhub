import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <Link to="/" className="font-display text-lg tracking-wide">
          LOOM<span className="text-primary">.</span>
        </Link>
        <p className="font-mono text-xs text-muted-foreground">
          Built for the Indian freelance market
        </p>
      </div>
    </footer>
  );
}
