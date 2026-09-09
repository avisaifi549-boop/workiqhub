import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import {
  Breadcrumbs,
  Section,
  CardGrid,
  InfoCard,
  FaqList,
  CtaRow,
} from "@/components/site/Sections";
import { TalentCard, type TalentRow } from "@/components/site/TalentCard";
import { JobCard, type JobRow } from "@/components/site/JobCard";
import { EmptyState } from "@/components/site/EmptyState";
import { listFreelancersIn, listJobsIn } from "@/lib/public.functions";
import { CATEGORY_GROUPS, categoryGroup, relatedGroups } from "@/lib/site/categories";
import { guide } from "@/lib/site/guides";

const groupQuery = (slug: string) =>
  queryOptions({
    queryKey: ["category-group", slug],
    queryFn: async () => {
      const group = categoryGroup(slug);
      if (!group) return { group: null, talent: [], jobs: [] };
      const [talent, jobs] = await Promise.all([
        listFreelancersIn({ data: { categories: group.dbCategories, limit: 12 } }).catch(() => []),
        listJobsIn({ data: { categories: group.dbCategories, limit: 6 } }).catch(() => []),
      ]);
      return { group, talent, jobs };
    },
  });

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(groupQuery(params.slug));
    if (!data.group) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const group = loaderData?.group;
    if (!group) {
      return { meta: [{ title: "Category unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${group.name} freelancers — hire verified specialists | WorkIQHub`;
    const description = group.description.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/categories/${params.slug}` }],
    };
  },
  component: CategoryGroupPage,
});

function CategoryGroupPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(groupQuery(slug));
  const group = data.group ?? CATEGORY_GROUPS[0]!;
  const guides = group.guides.map((g) => guide(g)).filter(Boolean);
  const related = relatedGroups(group.slug);

  return (
    <PageShell>
      <Breadcrumbs
        trail={[{ label: "Categories", to: "/categories" }, { label: group.short }]}
      />

      <section className="py-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Category</p>
        <h1 className="mt-5 max-w-[20ch] font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
          {group.name}
        </h1>
        <p className="mt-5 max-w-[64ch] text-lg text-muted-foreground">{group.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/post-a-job"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Post a project
          </Link>
          <Link
            to="/jobs/c/$category"
            params={{ category: group.slug }}
            className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border"
          >
            See {group.short} jobs
          </Link>
        </div>
      </section>

      <Section title="Skills in this category">
        <ul className="flex flex-wrap gap-2">
          {group.skills.map((s) => (
            <li
              key={s}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
            >
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Common projects">
        <CardGrid cols={2}>
          {group.services.map((s) => (
            <InfoCard key={s} title={s} body="Post it as a project and receive proposals from published freelancers in this category." />
          ))}
        </CardGrid>
      </Section>

      <Section title={`${group.short} freelancers`}>
        {data.talent.length === 0 ? (
          <EmptyState
            title="No published profiles in this category yet"
            description="We never fill a category with placeholder profiles. Post your project and freelancers whose skills match will be able to apply."
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

      <Section title="Open projects">
        {data.jobs.length === 0 ? (
          <EmptyState
            title="No open projects in this category right now"
            description="Job listings appear here as soon as clients publish them. Create a profile and you will be notified when a matching project goes live."
            action={
              <Link
                to="/get-started"
                className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border"
              >
                Create your profile
              </Link>
            }
          />
        ) : (
          <div className="space-y-5">
            {data.jobs.map((j) => (
              <JobCard key={j.id} job={j as unknown as JobRow} />
            ))}
          </div>
        )}
      </Section>

      {guides.length > 0 && (
        <Section title="Guides">
          <CardGrid cols={2}>
            {guides.map((g) => (
              <InfoCard
                key={g!.slug}
                meta="Guide"
                title={g!.title}
                body={g!.summary}
                to={`/guides/${g!.slug}`}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      {group.faqs.length > 0 && (
        <Section title={`${group.short} questions`}>
          <FaqList items={group.faqs} />
        </Section>
      )}

      {related.length > 0 && (
        <Section title="Related categories">
          <CardGrid>
            {related.map((r) => (
              <InfoCard
                key={r.slug}
                title={r.name}
                body={r.short}
                to={`/categories/${r.slug}`}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      <CtaRow
        primary={{ label: "Hire talent", to: "/freelancers" }}
        secondary={{ label: "Find work", to: "/jobs" }}
      />
    </PageShell>
  );
}
