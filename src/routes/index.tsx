import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { TalentCard, type TalentRow } from "@/components/site/TalentCard";
import { JobCard, type JobRow } from "@/components/site/JobCard";
import { EmptyState } from "@/components/site/EmptyState";
import { listFreelancers, listJobs } from "@/lib/public.functions";


type HomeData = {
  talent: Awaited<ReturnType<typeof listFreelancers>>;
  jobs: Awaited<ReturnType<typeof listJobs>>;
};

const homeQuery = queryOptions<HomeData>({
  queryKey: ["home"],
  queryFn: async () => {
    const [talent, jobs] = await Promise.all([
      listFreelancers({ data: { limit: 3 } }).catch(() => []),
      listJobs({ data: { limit: 2 } }).catch(() => []),
    ]);
    return { talent: talent ?? [], jobs: jobs ?? [] };
  },
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  head: () => ({
    meta: [
      { title: "WorkIQHub — Get discovered. Win more freelance work." },
      {
        name: "description",
        content:
          "An AI-powered freelance marketplace: verified talent, AI proposals, transparent pricing and secure milestone payments. Start free.",
      },
      { property: "og:title", content: "WorkIQHub — Get discovered. Win more freelance work." },
      {
        property: "og:description",
        content:
          "Verified freelancers, AI proposals and secure milestone payments in one platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: raw } = useSuspenseQuery(homeQuery);
  const data = { talent: raw?.talent ?? [], jobs: raw?.jobs ?? [] };

  return (
    <PageShell>
      <section className="relative grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
        <div className="relative lg:col-span-7">
          <div className="pointer-events-none absolute -inset-6 -rotate-3 rounded-3xl glass-strong border border-border" />
          <div className="relative">
            <p
              className="hero-enter font-mono text-xs uppercase tracking-[0.3em] text-primary"
              style={{ animationDelay: "0ms" }}
            >
              AI-native freelance marketplace
            </p>
            <h1
              className="hero-enter headline-sweep mt-6 font-display text-6xl leading-[0.92] uppercase tracking-tight sm:text-7xl lg:text-8xl"
              style={{ animationDelay: "80ms" }}
            >
              Get discovered.
              <br />
              Win more work.
            </h1>
            <p
              className="hero-enter mt-6 max-w-[42ch] text-lg text-pretty text-muted-foreground"
              style={{ animationDelay: "160ms" }}
            >
              Verified talent, AI proposals, and secure milestone payments in one engineered
              platform — built for freelancers and clients.
            </p>
            <div
              className="hero-enter mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-lg bg-primary px-6 py-3.5 text-center font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:brightness-110 hover:shadow-[0_10px_30px_-12px_var(--primary)]"
              >
                Start Freelancing Free
              </Link>
              <Link
                to="/freelancers"
                className="rounded-lg glass px-6 py-3.5 text-center font-semibold ring-1 ring-border transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/5 hover:ring-primary/50"
              >
                Hire a Freelancer
              </Link>
            </div>
            <p
              className="hero-enter mt-5 font-mono text-xs text-muted-foreground"
              style={{ animationDelay: "300ms" }}
            >
              No fake reviews · No invented stats · Secure escrow
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="hero-enter grid grid-cols-2 gap-4" style={{ animationDelay: "320ms" }}>
            <div className="float-a col-span-2 glass rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between">
                <span className="label-mono">Profile Strength</span>
                <span className="font-mono text-sm">
                  Live<span className="text-muted-foreground"> scoring</span>
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent/60">
                <div className="bar-fill h-full w-[62%] rounded-full bg-primary" />
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Every profile is scored on real completeness
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Only strong profiles get public, indexable pages
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Actionable fixes, not vanity metrics
                </li>
              </ul>
            </div>
            <div className="float-b glass rounded-2xl border border-border p-4">
              <p className="label-mono">Open jobs</p>
              <p className="mt-2 font-display text-4xl text-primary">{data.jobs.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Live on the marketplace</p>
            </div>
            <div className="float-c glass rounded-2xl border border-border p-4">
              <p className="label-mono">Talent</p>
              <p className="mt-2 font-display text-4xl">{data.talent.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Published profiles</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="flex items-end justify-between">
          <div>
            <SectionLabel index="a">Talent</SectionLabel>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-tight">
              Verified freelancers
            </h2>
          </div>
          <Link
            to="/freelancers"
            className="hidden rounded-md glass px-3 py-1.5 text-sm ring-1 ring-border md:block"
          >
            Browse all
          </Link>
        </div>

        <div className="mt-8">
          {data.talent.length === 0 ? (
            <EmptyState
              title="No published profiles yet"
              description="The marketplace shows only real, published freelancer profiles. Be the first — create yours and it appears here once it's strong enough."
              action={
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
                >
                  Create your free profile
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.talent.map((t) => (
                <TalentCard key={t.user_id} talent={t as unknown as TalentRow} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 py-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="b">Live jobs</SectionLabel>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-tight">Matched to you</h2>
          <p className="mt-4 max-w-[40ch] text-sm text-muted-foreground">
            Every job shows an explainable match score against your real skills, portfolio and
            pricing — and you can draft a proposal from your actual profile.
          </p>
        </div>
        <div className="space-y-5 lg:col-span-7">
          {data.jobs.length === 0 ? (
            <EmptyState
              title="No open jobs yet"
              description="Clients post projects here. When one goes live it appears in this feed with a match score."
              action={
                <Link
                  to="/jobs"
                  className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border"
                >
                  Go to job board
                </Link>
              }
            />
          ) : (
            data.jobs.map((j) => <JobCard key={j.id} job={j as unknown as JobRow} />)
          )}
        </div>
      </section>

      <section className="py-14">
        <SectionLabel index="c">How it works</SectionLabel>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-tight">
          Work that gets paid for
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Build a real profile",
              "Skills, portfolio and pricing. Profile strength is scored on evidence, never on what you pay.",
            ],
            [
              "Get matched",
              "Open projects are scored against your actual skills and past work, with the reasoning shown.",
            ],
            [
              "Agree milestones",
              "Scope is split into milestones. Each one is funded by the client before work begins.",
            ],
            [
              "Get paid on approval",
              "The client reviews the delivery and releases payment. Reviews only follow completed projects.",
            ],
          ].map(([title, body], i) => (
            <div key={title} className="glass rounded-2xl border border-border p-6">
              <span className="font-mono text-xs text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/get-started"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Create a free account
          </Link>
          <Link
            to="/categories"
            className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border"
          >
            Browse categories
          </Link>
        </div>
      </section>

    </PageShell>
  );
}
