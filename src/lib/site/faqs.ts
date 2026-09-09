/** FAQ content. Answers must stay consistent with what the platform actually does. */

export type FaqCategory = {
  slug: string;
  name: string;
  items: { q: string; a: string }[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    slug: "general",
    name: "General",
    items: [
      {
        q: "What is Loom?",
        a: "Loom is a freelance marketplace where businesses hire independent professionals and freelancers find work. Profiles, jobs, proposals, contracts, milestone payments and reviews all live in one place.",
      },
      {
        q: "How does the marketplace work?",
        a: "Clients post a project or search talent directly. Freelancers apply with a proposal. When both sides agree, a contract is created with milestones. The client funds a milestone, the freelancer delivers, the client approves, and payment is released. After completion both sides can review each other.",
      },
      {
        q: "Is it free to join?",
        a: "Yes. Creating an account, building a profile, posting a project and applying to jobs are free. Optional freelancer subscription plans are shown inside your dashboard once you are signed in.",
      },
      {
        q: "How do I create an account?",
        a: "Choose Get Started, pick whether you are hiring or freelancing, then create your account. You are taken straight into onboarding for that role and can save and continue at any point.",
      },
      {
        q: "Can I use the platform as both a freelancer and a client?",
        a: "Each account has one primary role so dashboards and notifications stay relevant. If you need both, use a separate account for the second role.",
      },
      {
        q: "How does verification work?",
        a: "Verification levels are reviewed by our team — identity verified, skill verified and top talent. Verification is never granted by buying a subscription.",
      },
    ],
  },
  {
    slug: "clients",
    name: "For clients",
    items: [
      {
        q: "How do I hire a freelancer?",
        a: "Either post a project and review applications, or browse the talent directory and invite the freelancers you shortlist. Once you agree scope, you create a contract with milestones.",
      },
      {
        q: "How do I post a project?",
        a: "From your dashboard, choose Post a project and describe the work, budget range, timeline, required skills and experience level. Projects stay in draft until you publish them.",
      },
      {
        q: "How do I choose a freelancer?",
        a: "Compare portfolios for work close to your problem, read verified reviews from completed marketplace projects, and judge whether the proposal engages with your actual brief.",
      },
      {
        q: "How do reviews work?",
        a: "Reviews can only be left after a completed project on the platform, and each side can leave one review per project. Ratings cover communication, quality, timeliness, professionalism and value.",
      },
      {
        q: "How are payments handled?",
        a: "Payments are milestone based. You fund a milestone before work starts on it, review the delivered work, and release payment on approval.",
      },
      {
        q: "What happens if a project goes wrong?",
        a: "Request revisions first — the milestone workflow includes a revision state. If the disagreement cannot be resolved between you, raise a dispute and our team reviews the project record.",
      },
      {
        q: "Can I hire the same freelancer again?",
        a: "Yes. Past projects stay in your dashboard, and you can start a new contract with a previous freelancer directly.",
      },
    ],
  },
  {
    slug: "freelancers",
    name: "For freelancers",
    items: [
      {
        q: "How do I start freelancing on Loom?",
        a: "Create a free account, complete the freelancer onboarding, and publish your profile. Your public profile becomes visible once it clears the profile strength quality bar.",
      },
      {
        q: "How do I create my profile?",
        a: "Onboarding walks through basics, professional information, services, portfolio, pricing and availability, and credentials. Progress is saved as you go, so you can finish later.",
      },
      {
        q: "How do I find projects?",
        a: "Browse the job board, filter by category, or use your dashboard where open jobs are scored against your real skills, portfolio and pricing.",
      },
      {
        q: "How do I apply for jobs?",
        a: "Open a job and submit a proposal with your cover letter, bid amount and delivery time. You can withdraw an application from your applications page.",
      },
      {
        q: "How does the proposal system work?",
        a: "Your proposal goes to the client, who can shortlist, move you to interview, hire or reject. Every status change is visible on your applications page.",
      },
      {
        q: "How do I receive payments?",
        a: "Payment is released to you when the client approves the milestone you delivered against.",
      },
      {
        q: "How do I get reviews?",
        a: "Complete a project on the platform. Reviews cannot be created without a completed contract, which is why every review on a profile is tied to real work.",
      },
      {
        q: "How do I become verified?",
        a: "Verification is reviewed by our team. It cannot be purchased, and a subscription never changes your verification level.",
      },
    ],
  },
  {
    slug: "projects-payments",
    name: "Projects & payments",
    items: [
      {
        q: "How do milestones work?",
        a: "A contract is split into milestones with their own amount and due date. Each moves through pending, funded, submitted, approved and released.",
      },
      {
        q: "When does a freelancer get paid?",
        a: "After the client approves the submitted milestone. Funding happens before the work, release happens after approval.",
      },
      {
        q: "Can a client request revisions?",
        a: "Yes. A submitted milestone can be sent back with a revision request before approval.",
      },
      {
        q: "What happens if there is a dispute?",
        a: "Either side can raise a dispute. Our team reviews the contract, milestones and project record before deciding on an outcome.",
      },
      {
        q: "How do refunds work?",
        a: "Refunds apply to funded milestones that were never approved, and are handled as part of the dispute outcome.",
      },
    ],
  },
  {
    slug: "account-security",
    name: "Account & security",
    items: [
      {
        q: "How is my information protected?",
        a: "Access to your data is enforced at the database level, so one account cannot read another account's private records. Email, phone and payment details are never shown on public profiles.",
      },
      {
        q: "How does identity verification work?",
        a: "You submit identity information for review by our team. Documents are used for verification only and are not shown on your public profile.",
      },
      {
        q: "Can I hide my profile?",
        a: "Yes. A profile can be unpublished from your profile settings, which removes it from the public directory and search engines.",
      },
      {
        q: "How do I change my email?",
        a: "Change it in your account settings. A confirmation is sent to the new address before the change takes effect.",
      },
      {
        q: "How do I delete my account?",
        a: "Contact support from the Contact page and choose Technical Problem or Client/Freelancer Support. Records tied to completed contracts may be retained where required for financial and legal reasons.",
      },
    ],
  },
  {
    slug: "subscriptions",
    name: "Subscriptions",
    items: [
      {
        q: "Does Loom have paid plans?",
        a: "There are optional freelancer subscription plans. They are shown inside your dashboard after you sign in, alongside your current plan.",
      },
      {
        q: "Do I need a paid plan to work on Loom?",
        a: "No. Building a profile, applying to jobs, winning work and getting paid all work on the free plan.",
      },
      {
        q: "Can a plan buy verification or better reviews?",
        a: "No. Verification is reviewed by our team, and reviews only come from completed projects. Paid visibility, where it appears, is clearly labelled.",
      },
      {
        q: "Where do I manage my subscription?",
        a: "Sign in and open Subscription in your dashboard sidebar to see your current plan and upgrade options.",
      },
    ],
  },
];

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
