import { Link } from "@tanstack/react-router";
import { formatInr } from "@/lib/plans";

export type TalentRow = {
  user_id: string;
  slug: string;
  headline: string;
  skills: string[];
  starting_price_inr: number | null;
  hourly_rate_inr: number | null;
  verification: string;
  profiles: { full_name: string; avatar_url: string | null; location: string | null } | null;
};

const VERIFICATION_LABEL: Record<string, string> = {
  identity_verified: "VERIFIED",
  skill_verified: "SKILL VERIFIED",
  top_talent: "TOP TALENT",
};

export function TalentCard({ talent }: { talent: TalentRow }) {
  const name = talent.profiles?.full_name || "Freelancer";
  const badge = VERIFICATION_LABEL[talent.verification];

  return (
    <article className="glass group rounded-2xl border border-border p-5 transition-all hover:-translate-y-1">
      <div className="flex items-start gap-4">
        {talent.profiles?.avatar_url ? (
          <img
            src={talent.profiles.avatar_url}
            alt={`${name} profile photo`}
            loading="lazy"
            className="size-14 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-surface font-display text-lg">
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold">
              <Link to="/freelancer/$slug" params={{ slug: talent.slug }} className="hover:text-primary">
                {name}
              </Link>
            </p>
            {badge && (
              <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                {badge}
              </span>
            )}
          </div>
          <p className="truncate text-sm text-muted-foreground">{talent.headline}</p>
        </div>
      </div>
      {talent.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {talent.skills.slice(0, 4).map((s) => (
            <span key={s} className="rounded-md bg-accent/50 px-2 py-1 text-xs text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <div>
          <p className="font-mono text-xs text-muted-foreground">From</p>
          <p className="font-semibold">{formatInr(talent.starting_price_inr)}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-muted-foreground">Hourly</p>
          <p className="font-semibold">{formatInr(talent.hourly_rate_inr)}</p>
        </div>
      </div>
    </article>
  );
}
