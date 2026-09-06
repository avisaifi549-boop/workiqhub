/** Shared option sets and labels for onboarding, profiles and marketplace UI. */

export const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
] as const;

export const EMPLOYMENT_STATUS = [
  { value: "full_time", label: "Full-time freelancer" },
  { value: "part_time", label: "Part-time freelancer" },
  { value: "agency", label: "Agency" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
] as const;

export const AVAILABILITY = [
  { value: "open", label: "Available now" },
  { value: "this_week", label: "Available this week" },
  { value: "busy", label: "Currently busy" },
  { value: "closed", label: "Not accepting projects" },
] as const;

export const PROJECT_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "enterprise", label: "Enterprise" },
] as const;

export const PRICING_TYPES = [
  { value: "fixed", label: "Fixed price" },
  { value: "hourly", label: "Hourly" },
  { value: "custom", label: "Custom quote" },
] as const;

export const CLIENT_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "startup", label: "Startup" },
  { value: "small_business", label: "Small business" },
  { value: "medium_business", label: "Medium business" },
  { value: "enterprise", label: "Enterprise" },
  { value: "agency", label: "Agency" },
  { value: "other", label: "Other" },
] as const;

export const HIRE_FREQUENCY = [
  { value: "first_time", label: "First time" },
  { value: "occasionally", label: "Occasionally" },
  { value: "monthly", label: "Monthly" },
  { value: "frequently", label: "Frequently" },
] as const;

export const TYPICAL_BUDGETS = [
  { value: "under_10k", label: "Under ₹10,000" },
  { value: "10k_50k", label: "₹10,000 – ₹50,000" },
  { value: "50k_1l", label: "₹50,000 – ₹1L" },
  { value: "1l_5l", label: "₹1L – ₹5L" },
  { value: "5l_plus", label: "₹5L+" },
] as const;

export const PREFERRED_EXPERIENCE = [
  ...EXPERIENCE_LEVELS,
  { value: "no_preference", label: "No preference" },
] as const;

export const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Punjabi",
];

export const CONTRACT_STATUS_LABEL: Record<string, string> = {
  hired: "Hired",
  contracted: "Contracted",
  milestone_funded: "Milestone funded",
  in_progress: "In progress",
  submitted: "Submitted",
  revision_requested: "Revision requested",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

export const MILESTONE_STATUS_LABEL: Record<string, string> = {
  pending: "Awaiting funding",
  funded: "Funded",
  submitted: "Submitted",
  approved: "Approved",
  released: "Payment released",
  cancelled: "Cancelled",
};

export function labelOf(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | null | undefined,
): string {
  return options.find((o) => o.value === value)?.label ?? "—";
}

export function averageRating(rows: { rating: number | string }[]): number | null {
  if (!rows.length) return null;
  const sum = rows.reduce((acc, r) => acc + Number(r.rating), 0);
  return Math.round((sum / rows.length) * 10) / 10;
}

export function ratingBreakdown(rows: { rating: number | string }[]) {
  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: rows.filter((r) => Math.round(Number(r.rating)) === star).length,
  }));
  const total = rows.length || 1;
  return buckets.map((b) => ({ ...b, pct: Math.round((b.count / total) * 1000) / 10 }));
}
