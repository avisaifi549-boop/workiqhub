import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass rounded-2xl border border-border p-10 text-center">
      <h3 className="font-display text-2xl uppercase tracking-tight">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass h-48 animate-pulse rounded-2xl border border-border" />
      ))}
    </div>
  );
}
