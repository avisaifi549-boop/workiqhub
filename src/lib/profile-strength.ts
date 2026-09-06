export type StrengthInput = {
  headline?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  languages?: string[] | null;
  hourly_rate_inr?: number | null;
  starting_price_inr?: number | null;
  category_id?: string | null;
  years_experience?: number | null;
  avatar_url?: string | null;
  portfolioCount?: number;
};

export type StrengthResult = {
  score: number;
  recommendations: string[];
};

/** Deterministic profile completeness score out of 100 with actionable gaps. */
export function profileStrength(input: StrengthInput): StrengthResult {
  const checks: { weight: number; ok: boolean; fix: string }[] = [
    { weight: 10, ok: !!input.avatar_url, fix: "Add a professional photo" },
    {
      weight: 14,
      ok: (input.headline?.trim().length ?? 0) >= 20,
      fix: "Write a specific professional headline",
    },
    {
      weight: 18,
      ok: (input.bio?.trim().length ?? 0) >= 200,
      fix: "Expand your bio to at least 200 characters",
    },
    {
      weight: 14,
      ok: (input.skills?.length ?? 0) >= 5,
      fix: "List at least 5 skills",
    },
    {
      weight: 8,
      ok: (input.languages?.length ?? 0) >= 1,
      fix: "Add the languages you work in",
    },
    {
      weight: 10,
      ok: !!input.hourly_rate_inr || !!input.starting_price_inr,
      fix: "Add your pricing",
    },
    {
      weight: 8,
      ok: !!input.category_id,
      fix: "Choose your specialization",
    },
    {
      weight: 6,
      ok: (input.years_experience ?? 0) > 0,
      fix: "Add your years of experience",
    },
    {
      weight: 12,
      ok: (input.portfolioCount ?? 0) >= 3,
      fix: `Add ${Math.max(0, 3 - (input.portfolioCount ?? 0))} more portfolio items`,
    },
  ];

  const score = checks.reduce((sum, c) => sum + (c.ok ? c.weight : 0), 0);
  return {
    score,
    recommendations: checks.filter((c) => !c.ok).map((c) => c.fix),
  };
}

/** A profile is only indexable when it carries real, unique information. */
export function isIndexable(input: StrengthInput): boolean {
  return profileStrength(input).score >= 60;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}
