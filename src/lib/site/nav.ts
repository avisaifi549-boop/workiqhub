/** Navigation information architecture. Every href must resolve to a real route. */

import { CATEGORY_GROUPS } from "./categories";

export type NavLink = { label: string; to: string };

export const HIRE_BY_CATEGORY: NavLink[] = CATEGORY_GROUPS.map((c) => ({
  label: c.name,
  to: `/categories/${c.slug}`,
}));

export const POPULAR_TALENT: NavLink[] = [
  { label: "AI Developers", to: "/hire/ai-developers" },
  { label: "AI Automation Experts", to: "/hire/automation-experts" },
  { label: "Web Developers", to: "/hire/web-developers" },
  { label: "Mobile App Developers", to: "/hire/mobile-app-developers" },
  { label: "React Developers", to: "/hire/react-developers" },
  { label: "Python Developers", to: "/hire/python-developers" },
  { label: "UI/UX Designers", to: "/hire/ui-ux-designers" },
  { label: "Graphic Designers", to: "/hire/graphic-designers" },
  { label: "SEO Experts", to: "/hire/seo-experts" },
  { label: "Digital Marketers", to: "/hire/digital-marketers" },
  { label: "Content Writers", to: "/hire/content-writers" },
  { label: "Video Editors", to: "/hire/video-editors" },
];

export const HIRE_FOR_PROJECT: NavLink[] = [
  { label: "Build a Website", to: "/hire/web-developers" },
  { label: "Build a Mobile App", to: "/hire/mobile-app-developers" },
  { label: "Design My Brand", to: "/hire/graphic-designers" },
  { label: "Improve My SEO", to: "/hire/seo-experts" },
  { label: "Run My Marketing", to: "/hire/digital-marketers" },
  { label: "Create Video Content", to: "/hire/video-editors" },
  { label: "Automate My Business", to: "/hire/automation-experts" },
  { label: "Build AI Solutions", to: "/hire/ai-developers" },
];

export const WORK_BY_CATEGORY: NavLink[] = CATEGORY_GROUPS.map((c) => ({
  label: c.name,
  to: `/jobs/c/${c.slug}`,
}));

export const POPULAR_OPPORTUNITIES: NavLink[] = [
  { label: "AI Developer Jobs", to: "/jobs/c/ai-automation" },
  { label: "Web Development Jobs", to: "/jobs/c/development" },
  { label: "Graphic Design Jobs", to: "/jobs/c/design" },
  { label: "SEO Jobs", to: "/jobs/c/marketing" },
  { label: "Digital Marketing Jobs", to: "/jobs/c/marketing" },
  { label: "Content Writing Jobs", to: "/jobs/c/writing" },
  { label: "Video Editing Jobs", to: "/jobs/c/video" },
  { label: "Mobile App Jobs", to: "/jobs/c/development" },
  { label: "UI/UX Jobs", to: "/jobs/c/design" },
  { label: "Virtual Assistant Jobs", to: "/jobs/c/admin" },
];

export const FREELANCER_RESOURCES: NavLink[] = [
  { label: "How to Start Freelancing", to: "/guides/how-to-start-freelancing" },
  { label: "How to Build a Strong Profile", to: "/guides/how-to-build-a-strong-profile" },
  { label: "How to Win More Projects", to: "/guides/how-to-win-more-projects" },
  { label: "How to Price Your Services", to: "/guides/how-much-should-a-freelancer-charge" },
  { label: "How to Write Better Proposals", to: "/guides/how-to-write-a-winning-proposal" },
  { label: "Freelancer Success Guide", to: "/guides/freelancer-success-guide" },
];

export const RESOURCE_LINKS: NavLink[] = [
  { label: "Guides", to: "/guides" },
  { label: "Blog", to: "/blog" },
  { label: "Freelancer Resources", to: "/resources/freelancers" },
  { label: "Client Resources", to: "/resources/clients" },
  { label: "Success Stories", to: "/success-stories" },
  { label: "Help Center", to: "/help" },
  { label: "FAQs", to: "/faqs" },
  { label: "Freelance Tools", to: "/tools" },
];

export const POPULAR_GUIDES: NavLink[] = [
  { label: "How to Hire a Freelancer", to: "/guides/how-to-hire-a-freelancer" },
  { label: "How to Start Freelancing", to: "/guides/how-to-start-freelancing" },
  { label: "How to Find Your First Client", to: "/guides/how-to-find-your-first-client" },
  { label: "How to Create a Great Portfolio", to: "/guides/how-to-create-a-great-portfolio" },
  {
    label: "How Much Should a Freelancer Charge?",
    to: "/guides/how-much-should-a-freelancer-charge",
  },
  { label: "How to Write a Winning Proposal", to: "/guides/how-to-write-a-winning-proposal" },
  { label: "How to Manage a Freelance Project", to: "/guides/how-to-manage-a-freelance-project" },
];

export const FREE_TOOLS: NavLink[] = [
  { label: "Freelance Rate Calculator", to: "/tools/rate-calculator" },
  { label: "Project Cost Calculator", to: "/tools/project-cost-calculator" },
  { label: "Invoice Generator", to: "/tools/invoice-generator" },
  { label: "Proposal Generator", to: "/tools/proposal-generator" },
  { label: "Job Description Generator", to: "/tools/job-description-generator" },
  { label: "Freelancer Profile Score", to: "/tools/profile-score" },
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "For clients",
    links: [
      { label: "Hire freelancers", to: "/freelancers" },
      { label: "Post a project", to: "/post-a-job" },
      { label: "Browse categories", to: "/categories" },
      { label: "How to hire", to: "/guides/how-to-hire-a-freelancer" },
      { label: "Client resources", to: "/resources/clients" },
      { label: "Client FAQs", to: "/faqs" },
    ],
  },
  {
    title: "For freelancers",
    links: [
      { label: "Find work", to: "/jobs" },
      { label: "Browse jobs by category", to: "/jobs" },
      { label: "Create your profile", to: "/get-started" },
      { label: "Freelancer resources", to: "/resources/freelancers" },
      { label: "Success stories", to: "/success-stories" },
      { label: "Freelancer FAQs", to: "/faqs" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Categories", to: "/categories" },
      { label: "Hire talent", to: "/freelancers" },
      { label: "Resources", to: "/resources" },
      { label: "Tools", to: "/tools" },
      { label: "Guides", to: "/guides" },
      { label: "Blog", to: "/blog" },
      { label: "Search", to: "/search" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about-us" },
      { label: "Why us", to: "/why-us" },
      { label: "Contact", to: "/contact" },
      { label: "Careers", to: "/careers" },
      { label: "Press", to: "/press" },
      { label: "Trust & safety", to: "/trust-and-safety" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", to: "/help" },
      { label: "Contact support", to: "/contact" },
      { label: "Report a problem", to: "/contact" },
      { label: "Dispute center", to: "/help/disputes" },
      { label: "FAQs", to: "/faqs" },
    ],
  },
];
