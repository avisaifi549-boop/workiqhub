import type { ReactNode } from "react";
import { GhostButton, PrimaryButton } from "@/components/dash/fields";

export function WizardShell({
  step,
  total,
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel = "Save and continue",
  busy,
  onSkip,
}: {
  step: number;
  total: number;
  title: string;
  description?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  busy?: boolean;
  onSkip?: () => void;
}) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="label-mono text-primary">
          Step {step} of {total}
        </p>
        <p className="font-mono text-xs text-muted-foreground">{pct}%</p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-accent/60">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <h1 className="mt-8 font-display text-3xl uppercase tracking-tight sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}

      <div className="mt-8 glass rounded-2xl border border-border p-6">{children}</div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {onBack && (
          <GhostButton type="button" onClick={onBack} disabled={busy}>
            Back
          </GhostButton>
        )}
        <PrimaryButton type="button" onClick={onNext} disabled={busy}>
          {busy ? "Saving…" : nextLabel}
        </PrimaryButton>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            disabled={busy}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Skip for now
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          Progress is saved — you can finish later.
        </span>
      </div>
    </div>
  );
}
