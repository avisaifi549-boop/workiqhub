import { Link } from "@tanstack/react-router";
import { formatInr } from "@/lib/plans";

export type JobRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  skills: string[];
  budget_min_inr: number | null;
  budget_max_inr: number | null;
  timeline_weeks: number | null;
  project_type: string;
  status: string;
  created_at: string;
};

export function JobCard({ job }: { job: JobRow }) {
  return (
    <article className="glass rounded-2xl border border-border p-6 transition-all hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-primary/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-primary">
          {job.status === "published" ? "Applications open" : job.status.replace("_", " ")}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-tight">
        <Link to="/jobs/$slug" params={{ slug: job.slug }} className="hover:text-primary">
          {job.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-accent/40 p-3">
          <p className="label-mono">Budget</p>
          <p className="mt-1 text-sm font-semibold">
            {job.budget_max_inr ? formatInr(job.budget_max_inr) : formatInr(job.budget_min_inr)}
          </p>
        </div>
        <div className="rounded-lg bg-accent/40 p-3">
          <p className="label-mono">Timeline</p>
          <p className="mt-1 text-sm font-semibold">
            {job.timeline_weeks ? `${job.timeline_weeks} wks` : "Flexible"}
          </p>
        </div>
        <div className="rounded-lg bg-accent/40 p-3">
          <p className="label-mono">Type</p>
          <p className="mt-1 text-sm font-semibold capitalize">{job.project_type}</p>
        </div>
      </div>
      {job.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 6).map((s) => (
            <span
              key={s}
              className="rounded-md bg-accent/50 px-2 py-1 text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
