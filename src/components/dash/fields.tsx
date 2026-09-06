import type { ReactNode } from "react";
import { useState } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-mono">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

const base =
  "mt-2 w-full rounded-lg border border-input bg-accent/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${base} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${base} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${base} ${props.className ?? ""}`} />;
}

export function ChoiceGrid<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: ReadonlyArray<{ value: T; label: string; description?: string }>;
  value: T | null;
  onChange: (v: T) => void;
  columns?: number;
}) {
  return (
    <div className={`mt-2 grid gap-2 sm:grid-cols-${columns}`}>
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => onChange(o.value)}
          className={
            value === o.value
              ? "rounded-lg border border-primary bg-primary/15 px-3 py-2.5 text-left text-sm font-semibold text-primary"
              : "rounded-lg border border-border bg-accent/30 px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/50"
          }
        >
          {o.label}
          {o.description && (
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
              {o.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function MultiChoice({
  options,
  values,
  onChange,
}: {
  options: ReadonlyArray<{ value: string; label: string }>;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((o) => {
        const on = values.includes(o.value);
        return (
          <button
            type="button"
            key={o.value}
            onClick={() =>
              onChange(on ? values.filter((v) => v !== o.value) : [...values, o.value])
            }
            className={
              on
                ? "rounded-full border border-primary bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary"
                : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Searchable free-text tag entry used for skills, technologies and languages. */
export function TagInput({
  values,
  onChange,
  placeholder,
  suggestions = [],
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");
  const filtered = draft
    ? suggestions
        .filter((s) => s.toLowerCase().includes(draft.toLowerCase()) && !values.includes(s))
        .slice(0, 6)
    : [];

  function add(tag: string) {
    const clean = tag.trim().slice(0, 40);
    if (!clean || values.includes(clean)) return;
    onChange([...values, clean]);
    setDraft("");
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-input bg-accent/40 p-2">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1.5 rounded-md bg-primary/15 px-2 py-1 text-xs text-primary"
          >
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))}>
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            }
            if (e.key === "Backspace" && !draft && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          placeholder={placeholder ?? "Type and press Enter"}
          className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm outline-none"
        />
      </div>
      {filtered.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60 ${props.className ?? ""}`}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg glass px-5 py-2.5 text-sm font-medium ring-1 ring-border transition-colors hover:text-primary disabled:opacity-60 ${props.className ?? ""}`}
    />
  );
}
