/** SEO hire landing pages. Each maps to real marketplace data. */

export type HirePage = {
  slug: string;
  role: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** DB `categories.slug` values used to pull real freelancers and jobs. */
  dbCategories: string[];
  /** Group slug for /categories/* cross-linking. */
  group: string;
  skills: string[];
  scopes: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

const projectWorkflow =
  "Every hire on Loom runs through the same workflow: agree scope, fund a milestone, review the delivered work, then release payment. Reviews are only possible after a completed marketplace project.";

export const HIRE_PAGES: HirePage[] = [
  {
    slug: "web-developers",
    role: "Web Developers",
    title: "Hire web developers",
    metaTitle: "Hire Web Developers — verified freelance web developers | Loom",
    metaDescription:
      "Hire freelance web developers with real portfolios, transparent pricing and milestone-based payments. Compare verified profiles and post your project free.",
    intro:
      "Web developers on Loom build and maintain sites and web applications — from marketing sites to logged-in product experiences. Compare real portfolios, then agree scope and milestones before any money moves.",
    dbCategories: ["web-developers", "wordpress-developers", "shopify-developers"],
    group: "development",
    skills: ["HTML & CSS", "JavaScript", "React", "Node.js", "WordPress", "Shopify", "APIs"],
    scopes: [
      {
        title: "Marketing website",
        body: "A few pages, a content model you can edit, analytics and a fast mobile experience. Usually one design milestone and one build milestone.",
      },
      {
        title: "Web application",
        body: "Accounts, data and business logic. Best split into a scoped MVP milestone followed by iterative feature milestones.",
      },
      {
        title: "Maintenance and fixes",
        body: "Ongoing work on an existing codebase. Hourly or recurring milestones keep this auditable.",
      },
    ],
    faqs: [
      {
        q: "What does a freelance web developer cost?",
        a: "Rates on Loom are set by each freelancer and shown on their profile. Use the rate calculator under Tools to sanity-check a budget, then compare actual profiles rather than an average.",
      },
      {
        q: "How do I protect my payment?",
        a: projectWorkflow,
      },
    ],
    related: ["react-developers", "mobile-app-developers", "ui-ux-designers"],
  },
  {
    slug: "mobile-app-developers",
    role: "Mobile App Developers",
    title: "Hire mobile app developers",
    metaTitle: "Hire Mobile App Developers — freelance iOS & Android | Loom",
    metaDescription:
      "Hire freelance mobile app developers for iOS and Android. Compare verified portfolios, agree milestones and pay only for approved work.",
    intro:
      "Mobile developers on Loom ship apps for iOS and Android, whether native or cross-platform. Share your feature list and the platforms you need, and compare profiles that have shipped comparable work.",
    dbCategories: ["app-developers"],
    group: "development",
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "App Store release", "Push & APIs"],
    scopes: [
      {
        title: "New app build",
        body: "Define a first release scope. Design, build and store submission usually run as three separate milestones.",
      },
      {
        title: "Feature work on an existing app",
        body: "Bring the repository and current release process; scope each feature as its own milestone.",
      },
      {
        title: "Store release support",
        body: "Preparing builds, assets and metadata for App Store and Google Play review.",
      },
    ],
    faqs: [
      {
        q: "Native or cross-platform?",
        a: "Cross-platform is usually faster and cheaper for standard product features. Native pays off when you depend heavily on platform-specific hardware or performance.",
      },
      { q: "How are payments handled?", a: projectWorkflow },
    ],
    related: ["react-developers", "ui-ux-designers", "web-developers"],
  },
  {
    slug: "react-developers",
    role: "React Developers",
    title: "Hire React developers",
    metaTitle: "Hire React Developers — verified freelance React talent | Loom",
    metaDescription:
      "Hire freelance React developers for web apps, dashboards and component libraries. Real portfolios, clear pricing and milestone payments.",
    intro:
      "React developers on Loom build interfaces and front-end architecture: component systems, dashboards, and full product front-ends wired to your APIs.",
    dbCategories: ["react-developers", "web-developers"],
    group: "development",
    skills: ["React", "TypeScript", "State management", "Design systems", "Testing", "Performance"],
    scopes: [
      {
        title: "Product front-end",
        body: "Build screens against an existing API, with routing, state and error handling.",
      },
      {
        title: "Component library",
        body: "A reusable, documented set of components so future work moves faster.",
      },
      {
        title: "Performance and refactor",
        body: "Improve load time, bundle size and rendering behaviour in an existing app.",
      },
    ],
    faqs: [
      {
        q: "Can a React developer also handle the backend?",
        a: "Many can. Check each profile's stated skills and portfolio; if backend work is essential, say so in your project description so proposals reflect it.",
      },
      { q: "How do reviews work?", a: projectWorkflow },
    ],
    related: ["web-developers", "mobile-app-developers", "ui-ux-designers"],
  },
  {
    slug: "python-developers",
    role: "Python Developers",
    title: "Hire Python developers",
    metaTitle: "Hire Python Developers — freelance backend & automation | Loom",
    metaDescription:
      "Hire freelance Python developers for APIs, data work, scraping and automation. Compare verified profiles and pay by milestone.",
    intro:
      "Python developers on Loom work on backends, data pipelines, scripting and automation. Describe the system and the data involved to get accurate proposals.",
    dbCategories: ["python-developers"],
    group: "development",
    skills: ["Python", "FastAPI & Django", "Data pipelines", "Automation", "APIs", "Testing"],
    scopes: [
      { title: "API or backend service", body: "Design and build endpoints, storage and auth." },
      {
        title: "Automation script",
        body: "Automate a repeatable task that currently takes manual hours each week.",
      },
      {
        title: "Data processing",
        body: "Ingest, clean and transform data into a usable, scheduled output.",
      },
    ],
    faqs: [
      {
        q: "Can Python developers help with AI features?",
        a: "Often yes — check the AI & Automation category for specialists who focus on model integration and agent workflows.",
      },
      { q: "How is scope agreed?", a: projectWorkflow },
    ],
    related: ["ai-developers", "automation-experts", "web-developers"],
  },
  {
    slug: "graphic-designers",
    role: "Graphic Designers",
    title: "Hire graphic designers",
    metaTitle: "Hire Graphic Designers — freelance brand & visual design | Loom",
    metaDescription:
      "Hire freelance graphic designers for brand identity, marketing assets and print. Compare portfolios and pay per approved milestone.",
    intro:
      "Graphic designers on Loom cover identity, marketing and print work. Share your brand context and where the assets will be used so proposals include the right deliverables.",
    dbCategories: ["graphic-designers"],
    group: "design",
    skills: ["Brand identity", "Logo design", "Marketing assets", "Print", "Illustration", "Packaging"],
    scopes: [
      {
        title: "Brand identity",
        body: "Logo, colour, type and usage guidelines delivered as a single system.",
      },
      { title: "Campaign assets", body: "Social, ad and email visuals built on an existing brand." },
      { title: "Print and packaging", body: "Print-ready artwork with correct specifications." },
    ],
    faqs: [
      {
        q: "How many concepts should I expect?",
        a: "Concept count and revision rounds are part of the proposal. Confirm them in the milestone description before funding.",
      },
      { q: "Do I get source files?", a: "Agree deliverables in writing before work starts — list source files explicitly if you need them." },
    ],
    related: ["ui-ux-designers", "video-editors", "content-writers"],
  },
  {
    slug: "ui-ux-designers",
    role: "UI/UX Designers",
    title: "Hire UI/UX designers",
    metaTitle: "Hire UI/UX Designers — freelance product design | Loom",
    metaDescription:
      "Hire freelance UI/UX designers for product interfaces, design systems and usability work. Verified portfolios and milestone-based payment.",
    intro:
      "UI/UX designers on Loom design product experiences: flows, screens and design systems that engineers can build from without guesswork.",
    dbCategories: ["ui-ux-designers"],
    group: "design",
    skills: ["User flows", "Wireframes", "UI design", "Design systems", "Prototyping", "Usability"],
    scopes: [
      { title: "New product design", body: "Flows, key screens and a component set ready for build." },
      { title: "Redesign", body: "Improve an existing product's structure, clarity and conversion." },
      { title: "Design system", body: "A documented component library shared with your engineers." },
    ],
    faqs: [
      {
        q: "Should design and development be one hire?",
        a: "They can be, but separate milestones for design and build keep review points clear even with a single freelancer.",
      },
      { q: "What do I receive?", a: "Editable design files plus any specification or prototype agreed in the milestone." },
    ],
    related: ["graphic-designers", "web-developers", "react-developers"],
  },
  {
    slug: "seo-experts",
    role: "SEO Experts",
    title: "Hire SEO experts",
    metaTitle: "Hire SEO Experts — freelance search specialists | Loom",
    metaDescription:
      "Hire freelance SEO experts for technical audits, content strategy and search visibility. Compare verified profiles and pay per milestone.",
    intro:
      "SEO specialists on Loom work on technical health, content strategy and search visibility. Ask for a measurement plan alongside the work itself.",
    dbCategories: ["seo-experts"],
    group: "marketing",
    skills: ["Technical SEO", "Keyword research", "Content strategy", "On-page", "Analytics", "Local SEO"],
    scopes: [
      { title: "Technical audit", body: "A prioritised list of fixes with expected impact and effort." },
      { title: "Content programme", body: "Topic research, briefs and a publishing plan." },
      { title: "Ongoing SEO", body: "Monthly milestones covering execution and reporting." },
    ],
    faqs: [
      {
        q: "How quickly does SEO work?",
        a: "Technical fixes can show up quickly; content and authority work usually takes months. Be sceptical of any guaranteed ranking claim.",
      },
      { q: "What access is needed?", a: "Analytics and search console access at minimum, granted at account level." },
    ],
    related: ["digital-marketers", "content-writers", "web-developers"],
  },
  {
    slug: "digital-marketers",
    role: "Digital Marketers",
    title: "Hire digital marketers",
    metaTitle: "Hire Digital Marketers — freelance growth & ads | Loom",
    metaDescription:
      "Hire freelance digital marketers for paid campaigns, lifecycle email and growth programmes. Verified profiles and milestone payments.",
    intro:
      "Digital marketers on Loom run acquisition and lifecycle programmes. Share your current channels, budget range and the metric you want moved.",
    dbCategories: ["seo-experts"],
    group: "marketing",
    skills: ["Paid ads", "Email marketing", "Social media", "Analytics", "Landing pages", "Funnels"],
    scopes: [
      { title: "Campaign setup", body: "Account structure, tracking and creative ready to launch." },
      { title: "Ongoing management", body: "Monthly optimisation with an agreed reporting cadence." },
      { title: "Growth audit", body: "A review of current channels with prioritised recommendations." },
    ],
    faqs: [
      {
        q: "Does ad spend go through Loom?",
        a: "No. Loom handles the freelancer's fee. Media spend stays on your own ad accounts.",
      },
      { q: "How is performance judged?", a: "Agree the metric and reporting format in the milestone before funding." },
    ],
    related: ["seo-experts", "content-writers", "video-editors"],
  },
  {
    slug: "content-writers",
    role: "Content Writers",
    title: "Hire content writers",
    metaTitle: "Hire Content Writers — freelance copy & content | Loom",
    metaDescription:
      "Hire freelance content writers for website copy, articles and documentation. Compare writing samples and pay per approved milestone.",
    intro:
      "Writers on Loom handle website copy, long-form content, documentation and editing. Share your audience and tone references for the most accurate proposals.",
    dbCategories: ["content-writers"],
    group: "writing",
    skills: ["Website copy", "SEO writing", "Long-form articles", "Technical writing", "Editing", "Scripts"],
    scopes: [
      { title: "Website copy", body: "Page-by-page copy shaped around what each page must achieve." },
      { title: "Article series", body: "A batch of researched articles delivered on a schedule." },
      { title: "Documentation", body: "Product or technical documentation your users can follow." },
    ],
    faqs: [
      {
        q: "How do I judge writing quality?",
        a: "Read full portfolio samples rather than snippets, and check whether the writer has covered your subject area before.",
      },
      { q: "Are revisions included?", a: "Revision rounds are stated in the proposal and confirmed in the milestone." },
    ],
    related: ["seo-experts", "digital-marketers", "graphic-designers"],
  },
  {
    slug: "video-editors",
    role: "Video Editors",
    title: "Hire video editors",
    metaTitle: "Hire Video Editors — freelance video & motion | Loom",
    metaDescription:
      "Hire freelance video editors for short-form, YouTube and motion graphics. Compare reels, agree milestones and pay for approved work.",
    intro:
      "Video editors on Loom cut short-form social video, long-form YouTube and branded content, and produce motion graphics.",
    dbCategories: ["video-editors"],
    group: "video",
    skills: ["Short-form editing", "YouTube editing", "Motion graphics", "Colour", "Sound", "Subtitles"],
    scopes: [
      { title: "Short-form batch", body: "A set of vertical edits produced from existing footage." },
      { title: "Long-form edit", body: "Full episode edits with graphics, sound and captions." },
      { title: "Motion graphics", body: "Animated explainers, titles and brand motion assets." },
    ],
    faqs: [
      {
        q: "What turnaround is realistic?",
        a: "It depends on footage volume and revision rounds. Agree a per-video turnaround in the milestone rather than assuming it.",
      },
      { q: "How do I share footage?", a: "Share via your own storage link inside the project workspace." },
    ],
    related: ["graphic-designers", "digital-marketers", "content-writers"],
  },
  {
    slug: "ai-developers",
    role: "AI Developers",
    title: "Hire AI developers",
    metaTitle: "Hire AI Developers — freelance AI engineers | Loom",
    metaDescription:
      "Hire freelance AI developers to build assistants, retrieval systems and AI features into your product. Verified profiles, milestone payments.",
    intro:
      "AI developers on Loom integrate models into real products: assistants, retrieval over your own documents, classification and evaluation pipelines.",
    dbCategories: ["python-developers"],
    group: "ai-automation",
    skills: ["LLM integration", "RAG & search", "Python", "Evaluation", "APIs", "Prompt engineering"],
    scopes: [
      { title: "Prototype", body: "A working proof of concept on your real data before wider investment." },
      { title: "Production feature", body: "An AI feature integrated into your product with monitoring." },
      { title: "Evaluation", body: "Test sets and measurement so quality is provable, not assumed." },
    ],
    faqs: [
      {
        q: "What does an AI project need from me?",
        a: "Sample data, a clear success definition and access to the system the feature will live in.",
      },
      { q: "Are results guaranteed?", a: "No responsible AI freelancer guarantees model output quality. Ask for an evaluation milestone instead." },
    ],
    related: ["automation-experts", "python-developers", "web-developers"],
  },
  {
    slug: "automation-experts",
    role: "Automation Experts",
    title: "Hire automation experts",
    metaTitle: "Hire Automation Experts — freelance workflow automation | Loom",
    metaDescription:
      "Hire freelance automation experts to connect your tools and remove manual work. Compare verified profiles and pay per milestone.",
    intro:
      "Automation specialists on Loom connect the tools a business already uses and remove repetitive manual steps — from CRM sync to reporting and internal approvals.",
    dbCategories: ["python-developers"],
    group: "ai-automation",
    skills: ["Workflow automation", "Integrations", "APIs", "Scripting", "CRM automation", "Reporting"],
    scopes: [
      { title: "Single workflow", body: "Automate one high-volume manual process end to end." },
      { title: "Systems integration", body: "Keep data in sync across the tools your team uses." },
      { title: "Reporting automation", body: "Scheduled reports assembled without manual work." },
    ],
    faqs: [
      {
        q: "How do I pick which process to automate first?",
        a: "Start with the task done most often that has a stable, well-understood set of steps.",
      },
      { q: "What happens if an automation breaks?", a: "Agree a support window or maintenance milestone in the contract." },
    ],
    related: ["ai-developers", "python-developers", "web-developers"],
  },
];

export function hirePage(slug: string): HirePage | undefined {
  return HIRE_PAGES.find((p) => p.slug === slug);
}
