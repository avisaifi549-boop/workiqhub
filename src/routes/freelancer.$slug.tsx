import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageShell";
import { getFreelancer } from "@/lib/public.functions";
import { formatInr } from "@/lib/plans";
import { profileStrength, isIndexable } from "@/lib/profile-strength";

const profileQuery = (slug: string) =>
  queryOptions({
    queryKey: ["freelancer", slug],
    queryFn: () => getFreelancer({ data: { slug } }),
  });

export const Route = createFileRoute("/freelancer/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(profileQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Profile unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.profile;
    const name = p.profiles?.full_name ?? "Freelancer";
    const input = {
      ...p,
      avatar_url: p.profiles?.avatar_url ?? null,
      portfolioCount: loaderData.portfolio.length,
    };
    const title = `${name} — ${p.headline} | Loom`;
    const description = (p.bio ?? p.headline ?? "Freelancer profile").slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(isIndexable(input) ? [] : [{ name: "robots", content: "noindex,follow" }]),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name,
            jobTitle: p.headline,
            description,
            knowsAbout: p.skills,
            address: p.profiles?.location ?? undefined,
          }),
        },
      ],
    };
  },
  component: FreelancerProfile,
});

function FreelancerProfile() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(profileQuery(slug));
  if (!data) throw notFound();
  const p = data.profile;
  const name = p.profiles?.full_name ?? "Freelancer";
  const strength = profileStrength({
    ...p,
    avatar_url: p.profiles?.avatar_url ?? null,
    portfolioCount: data.portfolio.length,
  });
  const portfolio = data.portfolio;

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
          <li className="text-foreground">{name}</li>
        </ol>
      </nav>

      <section className="grid gap-8 py-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <header className="glass-strong rounded-2xl border border-border p-7">
            <div className="flex flex-wrap items-start gap-5">
              {p.profiles?.avatar_url ? (
                <img
                  src={p.profiles.avatar_url}
                  alt={`${name} profile photo`}
                  className="size-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="grid size-20 place-items-center rounded-2xl bg-surface font-display text-3xl">
                  {name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-4xl uppercase tracking-tight">{name}</h1>
                <p className="mt-1 text-lg text-muted-foreground">{p.headline}</p>
                <div className="mt-3 flex flex-wrap gap-3 font-mono text-xs text-muted-foreground">
                  {p.profiles?.location && <span>{p.profiles.location}</span>}
                  <span>Responds in ~{p.response_time_hours}h</span>
                  <span className="capitalize">{String(p.availability).replace("_", " ")}</span>
                </div>
              </div>
            </div>
          </header>

          {p.bio && (
            <div className="mt-6 glass rounded-2xl border border-border p-7">
              <h2 className="font-display text-2xl uppercase tracking-tight">About</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{p.bio}</p>
            </div>
          )}

          {p.skills?.length > 0 && (
            <div className="mt-6 glass rounded-2xl border border-border p-7">
              <h2 className="font-display text-2xl uppercase tracking-tight">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.skills.map((s: string) => (
                  <span key={s} className="rounded-md bg-accent/50 px-2.5 py-1 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 glass rounded-2xl border border-border p-7">
            <h2 className="font-display text-2xl uppercase tracking-tight">Portfolio</h2>
            {portfolio.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No portfolio pieces published yet.
              </p>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {portfolio.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-border bg-accent/30 p-4"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        className="mb-3 aspect-video w-full rounded-lg object-cover"
                      />
                    )}
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1.5 text-sm text-muted-foreground">{item.description}</p>
                    )}
                    {item.outcome && (
                      <p className="mt-2 font-mono text-xs text-primary">{item.outcome}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-5">
            <div className="glass-strong rounded-2xl border border-border p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="label-mono">Starting at</p>
                  <p className="mt-1 font-display text-3xl">{formatInr(p.starting_price_inr)}</p>
                </div>
                <div className="text-right">
                  <p className="label-mono">Hourly</p>
                  <p className="mt-1 font-semibold">{formatInr(p.hourly_rate_inr)}</p>
                </div>
              </div>
              <Link
                to="/auth"
                search={{ mode: "signup", role: "client" }}
                className="mt-5 block rounded-lg bg-primary px-4 py-3 text-center font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
              >
                Hire {name.split(" ")[0]}
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signin" }}
                className="mt-2.5 block rounded-lg glass px-4 py-3 text-center font-semibold ring-1 ring-border"
              >
                Send a message
              </Link>
            </div>

            <div className="glass rounded-2xl border border-border p-6">
              <p className="label-mono">Profile Strength</p>
              <p className="mt-2 font-display text-4xl text-primary">{strength.score}/100</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent/60">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${strength.score}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Scored from real profile completeness — never from payment.
              </p>
            </div>

            {p.languages?.length > 0 && (
              <div className="glass rounded-2xl border border-border p-6">
                <p className="label-mono">Languages</p>
                <p className="mt-2 text-sm">{p.languages.join(", ")}</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
