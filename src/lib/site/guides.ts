/** Editorial guides. Original content — no invented statistics or testimonials. */

export type Guide = {
  slug: string;
  title: string;
  audience: "freelancers" | "clients" | "both";
  summary: string;
  readMinutes: number;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "how-to-hire-a-freelancer",
    title: "How to hire a freelancer",
    audience: "clients",
    summary:
      "A practical sequence for going from a vague need to a funded, well-scoped project with the right person.",
    readMinutes: 7,
    sections: [
      {
        heading: "Start with the outcome, not the task",
        paragraphs: [
          "The strongest project descriptions describe the result you need and how you will judge it. 'A five-page site that lets customers book a slot' attracts far better proposals than 'need a website'.",
          "Write down what success looks like at the end of the project. That single sentence becomes the basis of your milestone approval later.",
        ],
      },
      {
        heading: "Set a real budget range",
        paragraphs: [
          "A range signals seriousness and filters out mismatched proposals. If you are unsure, use the project cost calculator under Tools to build a range from scope rather than guesswork.",
        ],
      },
      {
        heading: "Shortlist on evidence",
        paragraphs: [
          "Compare portfolios for work that resembles your problem, not just work that looks attractive. Read verified reviews — on Loom these only exist after a completed marketplace project.",
        ],
        bullets: [
          "Does the portfolio show comparable scope?",
          "Does the proposal address your actual brief?",
          "Are the questions they ask specific?",
          "Is the timeline realistic rather than flattering?",
        ],
      },
      {
        heading: "Split the work into milestones",
        paragraphs: [
          "Fund the first milestone only. Review the delivered work, request revisions if needed, then approve and release. Repeat for each stage. This keeps risk small on both sides and creates an auditable record.",
        ],
      },
      {
        heading: "Keep everything in one place",
        paragraphs: [
          "Keep briefs, files and decisions inside the project so there is a single record if anything is disputed later.",
        ],
      },
    ],
  },
  {
    slug: "how-to-start-freelancing",
    title: "How to start freelancing",
    audience: "freelancers",
    summary:
      "What to set up first, what to charge, and how to get from an empty profile to your first paid project.",
    readMinutes: 8,
    sections: [
      {
        heading: "Pick a narrow starting point",
        paragraphs: [
          "Clients search for specific problems. 'React developer for SaaS dashboards' is easier to hire than 'developer'. You can widen later; starting narrow makes you findable now.",
        ],
      },
      {
        heading: "Build a profile that can be judged",
        paragraphs: [
          "A profile is evidence, not advertising. A headline that names your speciality, a bio that explains how you work, real portfolio pieces with the problem and outcome described, and clear pricing.",
        ],
        bullets: [
          "Speciality-led headline",
          "Two to five portfolio pieces with context",
          "Skills that match how clients search",
          "A starting price and availability you will honour",
        ],
      },
      {
        heading: "Price from your costs upward",
        paragraphs: [
          "Work out the annual income you need, add non-billable time and expenses, then divide by realistic billable hours. The hourly rate calculator under Tools does this arithmetic for you.",
        ],
      },
      {
        heading: "Apply with specificity",
        paragraphs: [
          "A short proposal that restates the client's problem, names your approach and links one relevant piece of work beats a long generic pitch. Never claim experience you do not have — verified reviews are the currency here.",
        ],
      },
      {
        heading: "Deliver in a way that earns the next project",
        paragraphs: [
          "Agree scope, communicate on a predictable rhythm, and deliver against the milestone as written. Repeat clients are the most reliable source of freelance income.",
        ],
      },
    ],
  },
  {
    slug: "how-to-build-a-strong-profile",
    title: "How to build a strong profile",
    audience: "freelancers",
    summary:
      "What Loom's profile strength score measures, and how to move each part of it honestly.",
    readMinutes: 6,
    sections: [
      {
        heading: "Profile strength is completeness, not flattery",
        paragraphs: [
          "Loom scores your profile on real completeness: headline, bio depth, skills, portfolio, pricing, availability and verification. It never rewards paying for a plan.",
          "Only profiles that clear the quality bar get a public, indexable page. That protects the value of every page on the marketplace.",
        ],
      },
      {
        heading: "The headline does most of the work",
        paragraphs: [
          "Name the discipline and the context you work in. Avoid adjectives that cannot be verified.",
        ],
      },
      {
        heading: "Portfolio pieces need context",
        paragraphs: [
          "For each piece, describe the problem, your role, what you built and what happened afterwards. Projects completed through Loom can carry a verified marker; self-reported work is shown as self-reported.",
        ],
      },
      {
        heading: "Pricing and availability are filters",
        paragraphs: [
          "Clients filter by both. Leaving them blank removes you from those results. Set numbers you are willing to honour and update them as you get busier.",
        ],
      },
    ],
  },
  {
    slug: "how-to-win-more-projects",
    title: "How to win more projects",
    audience: "freelancers",
    summary: "Why proposals get ignored, and the changes that measurably improve reply rates.",
    readMinutes: 6,
    sections: [
      {
        heading: "Apply to fewer jobs, better",
        paragraphs: [
          "Volume applications are easy to spot and easy to ignore. Choose jobs where your portfolio already proves you can do the work, then write to that specific brief.",
        ],
      },
      {
        heading: "Lead with their problem",
        paragraphs: [
          "Open with a sentence that shows you understood the project, then your approach, then one piece of relevant evidence. Save your background for the profile.",
        ],
      },
      {
        heading: "Ask one sharp question",
        paragraphs: [
          "A precise question signals experience and starts a conversation. Vague enthusiasm does not.",
        ],
      },
      {
        heading: "Make the next step easy",
        paragraphs: [
          "Propose a small first milestone. Lower commitment converts better than asking for the whole project up front.",
        ],
      },
    ],
  },
  {
    slug: "how-much-should-a-freelancer-charge",
    title: "How much should a freelancer charge?",
    audience: "both",
    summary: "A method for setting rates from costs, capacity and market position — not from guesswork.",
    readMinutes: 6,
    sections: [
      {
        heading: "Start from the income you need",
        paragraphs: [
          "Add your target income, business costs, taxes and unpaid time. Divide by the hours you can realistically bill — for most independent professionals that is well under half of a working week.",
        ],
      },
      {
        heading: "Then adjust for market position",
        paragraphs: [
          "Specialisation, proven outcomes and verified reviews all support higher rates. Compare against real profiles in your category rather than published averages.",
        ],
      },
      {
        heading: "Fixed price versus hourly",
        paragraphs: [
          "Fixed price suits well-defined scope and rewards efficiency. Hourly suits changing scope. Whichever you choose, define what is included before funding.",
        ],
      },
      {
        heading: "Raise rates deliberately",
        paragraphs: [
          "Raise on new clients first, then at natural renewal points with existing ones. Pair increases with evidence of results.",
        ],
      },
    ],
  },
  {
    slug: "how-to-write-a-winning-proposal",
    title: "How to write a winning proposal",
    audience: "freelancers",
    summary: "A simple proposal structure that answers what a client is actually deciding.",
    readMinutes: 5,
    sections: [
      {
        heading: "What the client is deciding",
        paragraphs: [
          "Can this person do the work, will they be easy to work with, and is the price and timeline believable? Everything in your proposal should serve one of those three questions.",
        ],
      },
      {
        heading: "A structure that works",
        paragraphs: ["Keep it short enough to read in under a minute."],
        bullets: [
          "One line restating the problem in your own words",
          "How you would approach it, in two or three steps",
          "One relevant piece of evidence with a link",
          "Price, timeline and what is included",
          "One clarifying question",
        ],
      },
      {
        heading: "Using AI honestly",
        paragraphs: [
          "Loom's proposal assistance drafts from your real profile, skills and portfolio. It will not invent experience, clients or results — and neither should you. Fabricated claims are grounds for removal.",
        ],
      },
    ],
  },
  {
    slug: "how-to-find-your-first-client",
    title: "How to find your first client",
    audience: "freelancers",
    summary: "Getting the first project without any platform history behind you.",
    readMinutes: 5,
    sections: [
      {
        heading: "Compensate for missing reviews with evidence",
        paragraphs: [
          "With no reviews yet, your portfolio carries the whole argument. Two well-documented pieces beat ten thumbnails.",
        ],
      },
      {
        heading: "Target smaller, clearer projects first",
        paragraphs: [
          "Well-scoped small projects are lower risk for a client to try you on, and they generate your first verified review.",
        ],
      },
      {
        heading: "Be responsive early",
        paragraphs: [
          "Response time is visible and matters to clients choosing between similar profiles.",
        ],
      },
      {
        heading: "Turn one project into two",
        paragraphs: [
          "Finish cleanly, summarise what was delivered, and suggest the logical next piece of work.",
        ],
      },
    ],
  },
  {
    slug: "how-to-create-a-great-portfolio",
    title: "How to create a great portfolio",
    audience: "freelancers",
    summary: "Choosing pieces, writing them up and showing outcomes without exaggeration.",
    readMinutes: 6,
    sections: [
      {
        heading: "Choose for relevance, not volume",
        paragraphs: [
          "Show work that resembles the work you want next. Anything unrelated dilutes the signal.",
        ],
      },
      {
        heading: "Write each piece as a short case",
        paragraphs: ["Every piece answers four questions."],
        bullets: [
          "What was the problem?",
          "What was your specific role?",
          "What did you make?",
          "What happened as a result?",
        ],
      },
      {
        heading: "Only claim outcomes you can support",
        paragraphs: [
          "If you do not have the numbers, describe what was delivered instead. Invented results are the fastest way to lose a client's trust in a call.",
        ],
      },
      {
        heading: "Verified versus self-reported",
        paragraphs: [
          "Projects completed through Loom can be linked to a real contract and shown as verified. Outside work is welcome, and is labelled as self-reported.",
        ],
      },
    ],
  },
  {
    slug: "how-to-manage-a-freelance-project",
    title: "How to manage a freelance project",
    audience: "both",
    summary: "Running a project so it finishes on time, on scope and without disputes.",
    readMinutes: 6,
    sections: [
      {
        heading: "Write the milestone as an acceptance test",
        paragraphs: [
          "A milestone description should be specific enough that both sides can tell whether it has been met. That removes almost all approval arguments.",
        ],
      },
      {
        heading: "Agree a communication rhythm",
        paragraphs: [
          "A short scheduled update beats ad-hoc chasing. Set the cadence at kickoff.",
        ],
      },
      {
        heading: "Handle scope changes explicitly",
        paragraphs: [
          "New requests become a new milestone. Absorbing them quietly is how projects slip and relationships sour.",
        ],
      },
      {
        heading: "Close the project properly",
        paragraphs: [
          "Approve, release payment, hand over files and leave a review. Both sides review each other — reputation on Loom is two-sided.",
        ],
      },
    ],
  },
  {
    slug: "freelancer-success-guide",
    title: "Freelancer success guide",
    audience: "freelancers",
    summary:
      "The full path: positioning, profile, pricing, proposals, delivery and repeat business, in order.",
    readMinutes: 10,
    sections: [
      {
        heading: "1. Position",
        paragraphs: [
          "Choose a discipline and a context. Being findable for something specific beats being available for everything.",
        ],
      },
      {
        heading: "2. Prove",
        paragraphs: [
          "Build a profile and portfolio that let a stranger judge your work in two minutes without contacting you.",
        ],
      },
      {
        heading: "3. Price",
        paragraphs: [
          "Set rates from your cost base and capacity, then adjust as your verified reputation grows.",
        ],
      },
      {
        heading: "4. Pitch",
        paragraphs: [
          "Apply selectively with proposals written to the brief. Never fabricate experience.",
        ],
      },
      {
        heading: "5. Deliver",
        paragraphs: [
          "Work to the milestone as written, communicate on a rhythm, and finish cleanly.",
        ],
      },
      {
        heading: "6. Repeat",
        paragraphs: [
          "Convert completed projects into verified reviews and repeat clients. That compounding is what turns freelancing into a career.",
        ],
      },
    ],
  },
];

export function guide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
