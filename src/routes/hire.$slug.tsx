import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import {
  Breadcrumbs,
  Section,
  CardGrid,
  InfoCard,
  Steps,
  FaqList,
  CtaRow,
} from "@/components/site/Sections";
import { TalentCard, type TalentRow } from "@/components/site/TalentCard";
import { EmptyState } from "@/components/site/EmptyState";
import { listFreelancersIn } from "@/lib/public.functions";
import { HIRE_PAGES, hirePage } from "@/lib/site/hire";

const hireQuery = (slug: string) =>
  queryOptions({
    queryKey: ["hire", slug],
    queryFn: async () => {
      const page = hirePage(slug);
      if (!page) return { page: null, talent: [] };
      const talent = await listFreelancersIn({
        data: { categories: page.dbCategories, limit: 12 },
      }).catch(() => []);
      return { page, talent };
    },
  });

export const Route = createFileRoute("/hire/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(hireQuery(params.slug));
    if (!data.page) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const page = loaderData?.page;
    if (!page) {
      return { meta: [{ title: "Page unavailable" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: page.metaTitle },
        { name: "description", content: page.metaDescription },
        { property: "og:title", content: page.metaTitle },
        { property: "og:description", content: page.metaDescription },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/hire/${params.slug}` }],
    };
  },
  component: HirePageRoute,
});

function HirePageRoute() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(hireQuery(slug));
  const page = data.page ?? HIRE_PAGES[0]!;
  const related = page.related.map((r) => hirePage(r)).filter(Boolean);

  return (
    <PageShell>
      <Breadcrumbs
        trail={[{ label: "Hire talent", to: "/freelancers" }, { label: page.role }]}
      />

      <section className="py-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Hire talent</p>
        <h1 className="mt-5 max-w-[20ch] font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
          {page.title}
        </h1>
        <p className="mt-5 max-w-[64ch] text-lg text-muted-foreground">{page.intro}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/post-a-job"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Post a project
          </Link>
          <Link
            to="/freelancers"
            className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border"
          >
            Browse all talent
          </Link>
        </div>
      </section>

      <Section title="How hiring works">
        <Steps
          items={[
            "Post your project or invite freelancers directly",
            "Compare proposals, portfolios and pricing",
            "Fund the first milestone to start work",
            "Review the delivery and release payment",
          ]}
        />
      </Section>

      <Section title="Skills to look for">
        <ul className="flex flex-wrap gap-2">
          {page.skills.map((s) => (
            <li
              key={s}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
            >
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Typical scopes">
        <CardGrid cols={2}>
          {page.scopes.map((s) => (
            <InfoCard key={s.title} title={s.title} body={s.body} />
          ))}
        </CardGrid>
      </Section>

      <Section title={`Available ${page.role.toLowerCase()}`}>
        {data.talent.length === 0 ? (
          <EmptyState
            title="No published profiles here yet"
            description="This page only lists real, published profiles — never placeholders. Post your project and matching freelancers can apply as they join."
            action={
              <Link
                to="/post-a-job"
                className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
              >
                Post a project
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
      </Section>

      <Section title="Questions about hiring">
        <FaqList items={page.faqs} />
      </Section>

      {related.length > 0 && (
        <Section title="Related searches">
          <CardGrid>
            {related.map((r) => (
              <InfoCard
                key={r!.slug}
                title={r!.title}
                body={r!.intro.slice(0, 120)}
                to={`/hire/${r!.slug}`}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      <CtaRow
        primary={{ label: "Post a project", to: "/post-a-job" }}
        secondary={{ label: "Browse categories", to: "/categories" }}
      />
    </PageShell>
  );
}
