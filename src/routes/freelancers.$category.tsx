import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { TalentCard, type TalentRow } from "@/components/site/TalentCard";
import { EmptyState } from "@/components/site/EmptyState";
import { listFreelancers, listCategories } from "@/lib/public.functions";

const categoryQuery = (slug: string) =>
  queryOptions({
    queryKey: ["freelancers", "category", slug],
    queryFn: async () => {
      const [talent, categories] = await Promise.all([
        listFreelancers({ data: { category: slug } }),
        listCategories(),
      ]);
      const category = categories.find((c) => c.slug === slug);
      return { talent, category };
    },
  });

export const Route = createFileRoute("/freelancers/$category")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(categoryQuery(params.category));
    if (!data.category) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Category unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const name = loaderData.category!.name;
    const title = `Hire ${name} in India — verified freelancers | Loom`;
    const description = `Compare verified ${name.toLowerCase()} with real portfolios, transparent pricing and secure milestone payments on Loom.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData.talent.length === 0
          ? [{ name: "robots", content: "noindex,follow" }]
          : []),
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category: slug } = Route.useParams();
  const { data } = useSuspenseQuery(categoryQuery(slug));
  const category = data.category!;

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="pt-8">
        <ol className="flex gap-2 font-mono text-xs text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link to="/freelancers" className="hover:text-primary">
              Freelancers
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{category.name}</li>
        </ol>
      </nav>

      <section className="py-10">
        <SectionLabel index="a">{category.slug}</SectionLabel>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-tight">
          Hire {category.name}
        </h1>
        <p className="mt-4 max-w-[56ch] text-muted-foreground">
          {category.description ??
            `Verified ${category.name.toLowerCase()} with published portfolios and transparent pricing.`}
        </p>

        <div className="mt-10">
          {data.talent.length === 0 ? (
            <EmptyState
              title={`No ${category.name.toLowerCase()} listed yet`}
              description="We don't fill categories with placeholder profiles. Post your project and matching freelancers will be invited to apply."
              action={
                <Link
                  to="/_authenticated/post-a-job"
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
        </div>
      </section>
    </PageShell>
  );
}
