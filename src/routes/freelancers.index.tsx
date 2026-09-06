import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { TalentCard, type TalentRow } from "@/components/site/TalentCard";
import { EmptyState } from "@/components/site/EmptyState";
import { listFreelancers, listCategories } from "@/lib/public.functions";

const talentQuery = queryOptions({
  queryKey: ["freelancers", "all"],
  queryFn: async () => {
    const [talent, categories] = await Promise.all([
      listFreelancers({ data: {} }),
      listCategories(),
    ]);
    return { talent, categories };
  },
});

export const Route = createFileRoute("/freelancers/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(talentQuery),
  head: () => ({
    meta: [
      { title: "Hire verified freelancers in India — Loom" },
      {
        name: "description",
        content:
          "Browse verified freelance developers, designers, writers and marketers with real portfolios, transparent pricing and secure milestone payments.",
      },
      { property: "og:title", content: "Hire verified freelancers in India — Loom" },
      {
        property: "og:description",
        content: "Verified freelancers with real portfolios and transparent pricing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FreelancersPage,
});

function FreelancersPage() {
  const { data } = useSuspenseQuery(talentQuery);

  return (
    <PageShell>
      <section className="py-14">
        <SectionLabel index="a">Talent directory</SectionLabel>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-tight">
          Hire verified freelancers
        </h1>
        <p className="mt-4 max-w-[52ch] text-muted-foreground">
          Only published profiles with real portfolios and pricing appear here. Verification is
          reviewed by our team — it can never be bought.
        </p>

        <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
          {data.categories.map((c) => (
            <Link
              key={c.id}
              to="/freelancers/$category"
              params={{ category: c.slug }}
              className="rounded-md glass px-3 py-1.5 text-sm ring-1 ring-border hover:text-primary"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          {data.talent.length === 0 ? (
            <EmptyState
              title="No published profiles yet"
              description="We only list real, complete freelancer profiles. Create yours — it goes live once your profile strength clears the quality bar."
              action={
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
                >
                  Start Freelancing Free
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
    </PageShell>
  );
}
