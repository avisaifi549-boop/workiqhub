import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Breadcrumbs, PageHero, FaqList } from "@/components/site/Sections";
import { FAQ_CATEGORIES, faqJsonLd } from "@/lib/site/faqs";
import { track } from "@/lib/site/track";

const ALL_ITEMS = FAQ_CATEGORIES.flatMap((c) => c.items);

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — how WorkIQHub works for clients and freelancers" },
      {
        name: "description",
        content:
          "Answers about hiring, freelancing, proposals, milestones, payments, reviews, verification, account security and subscriptions on WorkIQHub.",
      },
      { property: "og:title", content: "FAQs — how WorkIQHub works" },
      {
        property: "og:description",
        content: "Hiring, freelancing, milestones, payments, reviews, verification and security.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/faqs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd(ALL_ITEMS)),
      },
    ],
  }),
  component: Faqs,
});

function Faqs() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("all");

  const categories = useMemo(() => {
    const term = q.trim().toLowerCase();
    return FAQ_CATEGORIES.filter((c) => active === "all" || c.slug === active)
      .map((c) => ({
        ...c,
        items: term
          ? c.items.filter(
              (i) => i.q.toLowerCase().includes(term) || i.a.toLowerCase().includes(term),
            )
          : c.items,
      }))
      .filter((c) => c.items.length > 0);
  }, [q, active]);

  const total = categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "FAQs" }]} />
      <PageHero
        kicker="Help"
        title="Frequently asked questions"
        lead="How the marketplace works in practice — hiring, freelancing, projects, payments, reviews, security and subscriptions. If something here is unclear, contact us."
      />

      <section className="pb-6">
        <label htmlFor="faq-search" className="label-mono">
          Search the FAQs
        </label>
        <input
          id="faq-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onBlur={() => q.trim() && track("faq_search", { query_length: q.trim().length })}
          placeholder="milestones, verification, reviews…"
          className="mt-2 w-full max-w-xl rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        />

        <div className="mt-5 flex flex-wrap gap-2">
          {[{ slug: "all", name: "All" }, ...FAQ_CATEGORIES].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(c.slug)}
              className={
                active === c.slug
                  ? "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                  : "rounded-md glass px-3 py-1.5 text-sm ring-1 ring-border"
              }
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {total === 0 ? (
        <section className="border-t border-border py-14">
          <h2 className="font-display text-2xl uppercase tracking-tight">No matching questions</h2>
          <p className="mt-3 max-w-[52ch] text-muted-foreground">
            Nothing matched that search. Try a different word, or ask us directly.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Contact support
          </Link>
        </section>
      ) : (
        categories.map((c) => (
          <section key={c.slug} className="border-t border-border py-10">
            <h2 className="font-display text-2xl uppercase tracking-tight">{c.name}</h2>
            <div className="mt-6">
              <FaqList items={c.items} />
            </div>
          </section>
        ))
      )}

      <section className="border-t border-border py-14">
        <h2 className="font-display text-2xl uppercase tracking-tight">Still stuck?</h2>
        <p className="mt-3 max-w-[52ch] text-muted-foreground">
          The help center covers account, project and payment issues in more depth, and support can
          pick up anything it does not answer.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/help"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Help center
          </Link>
          <Link to="/contact" className="rounded-lg glass px-5 py-3 font-semibold ring-1 ring-border">
            Contact us
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
