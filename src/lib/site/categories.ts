/**
 * Top-level marketplace category groups used by navigation, /categories/* pages
 * and the job/hire landing pages. Each group maps to real DB category slugs.
 */

export type CategoryGroup = {
  slug: string;
  name: string;
  short: string;
  description: string;
  /** DB `categories.slug` values that belong to this group. */
  dbCategories: string[];
  skills: string[];
  services: string[];
  guides: string[];
  faqs: { q: string; a: string }[];
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: "ai-automation",
    name: "AI & Automation",
    short: "AI & Automation",
    description:
      "Specialists who build AI features and remove manual work: model integration, retrieval systems, chatbots, agents and workflow automation across the tools a business already uses.",
    dbCategories: ["python-developers"],
    skills: [
      "AI Developers",
      "AI Integration Developers",
      "Machine Learning Engineers",
      "Automation Experts",
      "Chatbot Developers",
      "AI Content Specialists",
      "AI Video Specialists",
      "Prompt Engineers",
    ],
    services: [
      "Add an AI assistant to an existing product",
      "Automate a repetitive internal workflow",
      "Build a document or knowledge search tool",
      "Connect internal tools with an automation layer",
    ],
    guides: ["how-to-hire-a-freelancer", "how-much-should-a-freelancer-charge"],
    faqs: [
      {
        q: "What should I prepare before hiring an AI freelancer?",
        a: "Describe the task you want automated, the tools and data involved, and how you will judge success. Concrete inputs and outputs lead to far more accurate proposals than a general brief.",
      },
      {
        q: "Do AI projects work on a milestone basis?",
        a: "Yes. Most AI work is split into a discovery or prototype milestone followed by build and integration milestones, so you can review results before funding the next stage.",
      },
    ],
  },
  {
    slug: "development",
    name: "Development & IT",
    short: "Development & IT",
    description:
      "Engineers who build and maintain software: web applications, mobile apps, e-commerce storefronts, APIs, integrations and ongoing technical maintenance.",
    dbCategories: [
      "web-developers",
      "react-developers",
      "app-developers",
      "python-developers",
      "shopify-developers",
      "wordpress-developers",
    ],
    skills: [
      "Web Developers",
      "React Developers",
      "Mobile App Developers",
      "Python Developers",
      "Shopify Developers",
      "WordPress Developers",
      "Backend & API Developers",
      "QA & Testing",
    ],
    services: [
      "Build a marketing website",
      "Build a web application",
      "Build a mobile app",
      "Fix, maintain or speed up an existing site",
    ],
    guides: ["how-to-hire-a-freelancer", "how-to-manage-a-freelance-project"],
    faqs: [
      {
        q: "Should I hire hourly or by project?",
        a: "Fixed milestones suit a defined scope, such as a website or a specific feature. Hourly suits open-ended maintenance or ongoing product work where scope changes week to week.",
      },
      {
        q: "Who owns the code?",
        a: "Ownership is agreed in the contract before work starts. Set it out in the project description so both sides work from the same expectation.",
      },
    ],
  },
  {
    slug: "design",
    name: "Design & Creative",
    short: "Design & Creative",
    description:
      "Designers who shape how a product or brand looks and works: product interfaces, design systems, brand identity, marketing assets and presentation material.",
    dbCategories: ["ui-ux-designers", "graphic-designers"],
    skills: [
      "UI/UX Designers",
      "Product Designers",
      "Graphic Designers",
      "Brand Identity Designers",
      "Illustrators",
      "Presentation Designers",
    ],
    services: [
      "Design a brand identity",
      "Design a product interface",
      "Redesign an existing website",
      "Create marketing and social assets",
    ],
    guides: ["how-to-create-a-great-portfolio", "how-to-hire-a-freelancer"],
    faqs: [
      {
        q: "How do I compare designers fairly?",
        a: "Look at portfolio work in a context close to yours, read the problem each project solved, and check verified reviews from completed marketplace projects rather than the visual polish alone.",
      },
      {
        q: "What files should I ask for?",
        a: "Agree deliverables up front: source files, exported assets, and any brand guidelines. Add them to the milestone description so approval is unambiguous.",
      },
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    short: "Marketing",
    description:
      "Marketers who bring in demand: search visibility, paid acquisition, lifecycle email, social and analytics — measured against traffic, leads and revenue.",
    dbCategories: ["seo-experts"],
    skills: [
      "SEO Experts",
      "Digital Marketers",
      "Paid Ads Specialists",
      "Email Marketers",
      "Social Media Managers",
      "Marketing Analysts",
    ],
    services: [
      "Improve organic search visibility",
      "Run and optimise paid campaigns",
      "Set up analytics and reporting",
      "Plan and run a content programme",
    ],
    guides: ["how-to-hire-a-freelancer", "how-to-manage-a-freelance-project"],
    faqs: [
      {
        q: "How long before marketing work shows results?",
        a: "Paid campaigns produce data within days. Search and content work usually needs months. Ask for a milestone plan that separates setup, execution and measurement.",
      },
      {
        q: "What access will a marketer need?",
        a: "Typically analytics, search console and ad accounts. Grant access at the account level so it can be revoked when the project ends — never share personal passwords.",
      },
    ],
  },
  {
    slug: "writing",
    name: "Writing & Content",
    short: "Writing & Content",
    description:
      "Writers and editors for content that has to perform: website copy, long-form articles, technical documentation, product descriptions and editing.",
    dbCategories: ["content-writers"],
    skills: [
      "Content Writers",
      "Copywriters",
      "SEO Writers",
      "Technical Writers",
      "Editors & Proofreaders",
      "Scriptwriters",
    ],
    services: [
      "Write website and landing page copy",
      "Produce a series of articles",
      "Write product or technical documentation",
      "Edit and proofread existing content",
    ],
    guides: ["how-to-write-a-winning-proposal", "how-much-should-a-freelancer-charge"],
    faqs: [
      {
        q: "How do I brief a writer well?",
        a: "Share the audience, the goal of the piece, the tone you want and any examples you like. A short reference brief improves first drafts more than a longer word count target.",
      },
      {
        q: "Can I request revisions?",
        a: "Yes. Revision rounds are agreed in the milestone before funding, so both sides know what is included.",
      },
    ],
  },
  {
    slug: "video",
    name: "Video & Audio",
    short: "Video & Audio",
    description:
      "Editors and producers for video and sound: short-form social edits, long-form YouTube, motion graphics, podcast editing and voice work.",
    dbCategories: ["video-editors"],
    skills: [
      "Video Editors",
      "Short-form Editors",
      "Motion Graphics Designers",
      "Podcast Editors",
      "Voice Over Artists",
      "Sound Designers",
    ],
    services: [
      "Edit short-form social video",
      "Edit long-form YouTube video",
      "Produce motion graphics",
      "Edit and master a podcast",
    ],
    guides: ["how-to-hire-a-freelancer", "how-to-create-a-great-portfolio"],
    faqs: [
      {
        q: "What do editors need from me?",
        a: "Raw footage, brand assets, and a reference video showing the pace and style you want. Clear references shorten revision cycles.",
      },
      {
        q: "How are large files handled?",
        a: "Share footage through your own storage link inside the project workspace so files stay under your control.",
      },
    ],
  },
  {
    slug: "data",
    name: "Data & Analytics",
    short: "Data & Analytics",
    description:
      "Data professionals who turn raw data into decisions: pipelines, dashboards, reporting, analysis and data quality work.",
    dbCategories: [],
    skills: [
      "Data Analysts",
      "Data Engineers",
      "BI & Dashboard Specialists",
      "SQL Specialists",
      "Data Visualisation Designers",
    ],
    services: [
      "Build a reporting dashboard",
      "Clean and structure a dataset",
      "Set up a data pipeline",
      "Analyse performance and report findings",
    ],
    guides: ["how-to-hire-a-freelancer"],
    faqs: [
      {
        q: "How do I share data safely?",
        a: "Share anonymised or sample data first, and only grant access to production systems once scope is agreed and access can be scoped and revoked.",
      },
    ],
  },
  {
    slug: "admin",
    name: "Admin & Support",
    short: "Admin & Support",
    description:
      "Operational support that keeps a business moving: virtual assistance, customer support, data entry, scheduling and research.",
    dbCategories: [],
    skills: [
      "Virtual Assistants",
      "Customer Support Specialists",
      "Data Entry Specialists",
      "Research Assistants",
      "Operations Support",
    ],
    services: [
      "Ongoing virtual assistance",
      "Customer support coverage",
      "Research and data entry projects",
      "Inbox and calendar management",
    ],
    guides: ["how-to-hire-a-freelancer", "how-to-manage-a-freelance-project"],
    faqs: [
      {
        q: "Can I hire someone ongoing rather than per project?",
        a: "Yes. Set up recurring milestones for each period of work so time and payment stay auditable.",
      },
    ],
  },
  {
    slug: "business",
    name: "Business & Consulting",
    short: "Business & Consulting",
    description:
      "Independent consultants for planning and finance work: business strategy, financial modelling, bookkeeping, project management and market research.",
    dbCategories: [],
    skills: [
      "Business Consultants",
      "Financial Analysts",
      "Bookkeepers",
      "Project Managers",
      "Market Researchers",
    ],
    services: [
      "Build a financial model",
      "Run a market research study",
      "Set up bookkeeping and reporting",
      "Manage a project end to end",
    ],
    guides: ["how-to-hire-a-freelancer", "how-much-should-a-freelancer-charge"],
    faqs: [
      {
        q: "How are consulting engagements structured?",
        a: "Usually as milestones tied to deliverables — a diagnostic, a recommendation and an implementation plan — so each stage is reviewed before the next is funded.",
      },
    ],
  },
];

export function categoryGroup(slug: string): CategoryGroup | undefined {
  return CATEGORY_GROUPS.find((c) => c.slug === slug);
}

export function relatedGroups(slug: string, count = 3): CategoryGroup[] {
  const index = CATEGORY_GROUPS.findIndex((c) => c.slug === slug);
  const rest = CATEGORY_GROUPS.filter((_, i) => i !== index);
  return rest.slice(0, count);
}
