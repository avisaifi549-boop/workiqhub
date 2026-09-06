/**
 * Centralised subscription / entitlement system.
 * Change limits here — never scatter plan checks through the app.
 */

export type PlanTier = "free" | "starter" | "pro" | "elite";

export type Entitlements = {
  monthlyApplications: number;
  monthlyAiProposals: number;
  aiProfileOptimizer: boolean;
  aiPricingAdvisor: boolean;
  profileBoost: boolean;
  proposalBoost: boolean;
  verifiedBadge: boolean;
  featuredPlacement: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  teamFeatures: boolean;
  portfolioItems: number;
  searchWeight: number;
};

export type Plan = {
  tier: PlanTier;
  name: string;
  priceInr: number;
  tagline: string;
  highlights: string[];
  mostPopular?: boolean;
  entitlements: Entitlements;
};

export const PLANS: Plan[] = [
  {
    tier: "free",
    name: "Free",
    priceInr: 0,
    tagline: "Get discovered",
    highlights: ["Public profile", "Portfolio", "Basic visibility", "Limited applications"],
    entitlements: {
      monthlyApplications: 10,
      monthlyAiProposals: 0,
      aiProfileOptimizer: false,
      aiPricingAdvisor: false,
      profileBoost: false,
      proposalBoost: false,
      verifiedBadge: false,
      featuredPlacement: false,
      advancedAnalytics: false,
      prioritySupport: false,
      teamFeatures: false,
      portfolioItems: 4,
      searchWeight: 1,
    },
  },
  {
    tier: "starter",
    name: "Starter",
    priceInr: 299,
    tagline: "Apply more, apply better",
    highlights: [
      "More applications",
      "AI proposal generation",
      "AI profile optimizer",
      "Faster job alerts",
    ],
    entitlements: {
      monthlyApplications: 40,
      monthlyAiProposals: 30,
      aiProfileOptimizer: true,
      aiPricingAdvisor: false,
      profileBoost: true,
      proposalBoost: false,
      verifiedBadge: false,
      featuredPlacement: false,
      advancedAnalytics: false,
      prioritySupport: false,
      teamFeatures: false,
      portfolioItems: 10,
      searchWeight: 1.15,
    },
  },
  {
    tier: "pro",
    name: "Pro",
    priceInr: 999,
    tagline: "Win consistently",
    mostPopular: true,
    highlights: [
      "Higher AI allowance",
      "Verified badge",
      "AI pricing advisor",
      "Priority lead alerts",
      "Better search visibility",
    ],
    entitlements: {
      monthlyApplications: 150,
      monthlyAiProposals: 150,
      aiProfileOptimizer: true,
      aiPricingAdvisor: true,
      profileBoost: true,
      proposalBoost: true,
      verifiedBadge: true,
      featuredPlacement: false,
      advancedAnalytics: true,
      prioritySupport: false,
      teamFeatures: false,
      portfolioItems: 25,
      searchWeight: 1.35,
    },
  },
  {
    tier: "elite",
    name: "Elite",
    priceInr: 2999,
    tagline: "Maximum visibility",
    highlights: [
      "Max AI usage",
      "Featured placement",
      "Agency / team features",
      "Priority support",
    ],
    entitlements: {
      monthlyApplications: 1000,
      monthlyAiProposals: 1000,
      aiProfileOptimizer: true,
      aiPricingAdvisor: true,
      profileBoost: true,
      proposalBoost: true,
      verifiedBadge: true,
      featuredPlacement: true,
      advancedAnalytics: true,
      prioritySupport: true,
      teamFeatures: true,
      portfolioItems: 100,
      searchWeight: 1.6,
    },
  },
];

export function getPlan(tier: PlanTier | null | undefined): Plan {
  return PLANS.find((p) => p.tier === tier) ?? PLANS[0]!;
}

export function can<K extends keyof Entitlements>(
  tier: PlanTier | null | undefined,
  key: K,
): Entitlements[K] {
  return getPlan(tier).entitlements[key];
}

export function formatInr(value: number | null | undefined): string {
  if (value == null) return "—";
  return `₹${value.toLocaleString("en-IN")}`;
}
