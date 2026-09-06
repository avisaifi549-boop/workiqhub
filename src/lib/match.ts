export type MatchInput = {
  jobSkills: string[];
  jobBudgetMin?: number | null;
  jobBudgetMax?: number | null;
  freelancerSkills: string[];
  freelancerStartingPrice?: number | null;
  portfolioCount?: number;
  yearsExperience?: number | null;
};

export type MatchResult = {
  score: number;
  matching: string[];
  missing: string[];
  reasons: string[];
};

const norm = (s: string) => s.trim().toLowerCase();

/** Transparent, explainable match score — no black box, no invented data. */
export function matchScore(input: MatchInput): MatchResult {
  const jobSkills = input.jobSkills.map(norm).filter(Boolean);
  const mine = new Set(input.freelancerSkills.map(norm).filter(Boolean));

  const matching = jobSkills.filter((s) => mine.has(s));
  const missing = jobSkills.filter((s) => !mine.has(s));

  const skillRatio = jobSkills.length ? matching.length / jobSkills.length : 0.5;
  let score = skillRatio * 65;
  const reasons: string[] = [];

  if (matching.length) {
    reasons.push(`${matching.length} of ${jobSkills.length} required skills matched`);
  }

  const portfolio = input.portfolioCount ?? 0;
  const portfolioPoints = Math.min(portfolio, 4) * 3.75;
  score += portfolioPoints;
  if (portfolio > 0) reasons.push(`${portfolio} portfolio item${portfolio > 1 ? "s" : ""} to show`);

  const years = input.yearsExperience ?? 0;
  score += Math.min(years, 5) * 2;
  if (years > 0) reasons.push(`${years} year${years > 1 ? "s" : ""} of experience`);

  const price = input.freelancerStartingPrice;
  const max = input.jobBudgetMax;
  if (price != null && max != null) {
    if (price <= max) {
      score += 10;
      reasons.push("Budget fits your starting price");
    } else {
      reasons.push("Job budget is below your usual starting price");
    }
  }

  return {
    score: Math.max(0, Math.min(99, Math.round(score))),
    matching,
    missing,
    reasons,
  };
}
