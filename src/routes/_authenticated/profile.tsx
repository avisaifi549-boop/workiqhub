import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { CardSkeleton } from "@/components/site/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { slugify, profileStrength } from "@/lib/profile-strength";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Edit your freelancer profile — Loom" },
      { name: "description", content: "Update your headline, skills, pricing and availability." },
      { property: "og:title", content: "Edit your freelancer profile — Loom" },
      {
        property: "og:description",
        content: "Update your headline, skills, pricing and availability.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfileEditor,
});

const field =
  "mt-2 w-full rounded-lg border border-input bg-accent/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function ProfileEditor() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["profile-editor", user.id],
    queryFn: async () => {
      const [profileRes, freelancerRes, categoriesRes, portfolioRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("freelancer_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("categories").select("id, name, slug").order("sort_order"),
        supabase.from("portfolio_items").select("id").eq("user_id", user.id),
      ]);
      return {
        profile: profileRes.data,
        freelancer: freelancerRes.data,
        categories: categoriesRes.data ?? [],
        portfolioCount: portfolioRes.data?.length ?? 0,
      };
    },
  });

  const [form, setForm] = useState({
    full_name: "",
    location: "",
    headline: "",
    bio: "",
    category_id: "",
    skills: "",
    languages: "",
    hourly_rate_inr: "",
    starting_price_inr: "",
    availability: "available",
    response_time_hours: "24",
    years_experience: "0",
    is_published: false,
  });

  useEffect(() => {
    if (!data) return;
    const f = data.freelancer;
    setForm({
      full_name: data.profile?.full_name ?? "",
      location: data.profile?.location ?? "",
      headline: f?.headline ?? "",
      bio: f?.bio ?? "",
      category_id: f?.category_id ?? "",
      skills: (f?.skills ?? []).join(", "),
      languages: (f?.languages ?? []).join(", "),
      hourly_rate_inr: f?.hourly_rate_inr ? String(f.hourly_rate_inr) : "",
      starting_price_inr: f?.starting_price_inr ? String(f.starting_price_inr) : "",
      availability: f?.availability ?? "available",
      response_time_hours: String(f?.response_time_hours ?? 24),
      years_experience: String(f?.years_experience ?? 0),
      is_published: f?.is_published ?? false,
    });
  }, [data]);

  const skillsArr = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
  const languagesArr = form.languages.split(",").map((s) => s.trim()).filter(Boolean);
  const strength = profileStrength({
    avatar_url: data?.profile?.avatar_url ?? null,
    headline: form.headline,
    bio: form.bio,
    skills: skillsArr,
    languages: languagesArr,
    hourly_rate_inr: Number(form.hourly_rate_inr) || null,
    starting_price_inr: Number(form.starting_price_inr) || null,
    category_id: form.category_id || null,
    years_experience: Number(form.years_experience) || 0,
    portfolio_items: Array.from({ length: data?.portfolioCount ?? 0 }),
  } as never);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const { error: pErr } = await supabase
        .from("profiles")
        .update({ full_name: form.full_name, location: form.location || null })
        .eq("id", user.id);
      if (pErr) throw pErr;

      const slug =
        data.freelancer?.slug ?? `${slugify(form.full_name || "freelancer")}-${user.id.slice(0, 6)}`;

      const payload = {
        user_id: user.id,
        slug,
        headline: form.headline,
        bio: form.bio || null,
        category_id: form.category_id || null,
        skills: skillsArr,
        languages: languagesArr,
        hourly_rate_inr: form.hourly_rate_inr ? Number(form.hourly_rate_inr) : null,
        starting_price_inr: form.starting_price_inr ? Number(form.starting_price_inr) : null,
        availability: form.availability,
        response_time_hours: Number(form.response_time_hours) || 24,
        years_experience: Number(form.years_experience) || 0,
        is_published: form.is_published,
      };

      const { error: fErr } = await supabase
        .from("freelancer_profiles")
        .upsert(payload as never, { onConflict: "user_id" });
      if (fErr) throw fErr;

      await queryClient.invalidateQueries();
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !data) {
    return (
      <PageShell>
        <div className="py-14">
          <CardSkeleton count={2} />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="py-12">
        <SectionLabel index="a">Profile</SectionLabel>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-tight">Your profile</h1>
        <p className="mt-3 max-w-[52ch] text-muted-foreground">
          Everything here is your own real information. Publish only when it's accurate — we never
          generate fake experience or results.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <form onSubmit={save} className="space-y-6 lg:col-span-8">
            <div className="glass rounded-2xl border border-border p-6">
              <h2 className="font-display text-2xl uppercase tracking-tight">Basics</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="full_name" className="label-mono">
                    Full name
                  </label>
                  <input
                    id="full_name"
                    required
                    className={field}
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="location" className="label-mono">
                    Location
                  </label>
                  <input
                    id="location"
                    placeholder="Bangalore, India"
                    className={field}
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="headline" className="label-mono">
                  Headline
                </label>
                <input
                  id="headline"
                  required
                  placeholder="React developer building fast e-commerce storefronts"
                  className={field}
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="bio" className="label-mono">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={6}
                  placeholder="What you do, who you do it for, and the outcomes you've actually delivered."
                  className={field}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            </div>

            <div className="glass rounded-2xl border border-border p-6">
              <h2 className="font-display text-2xl uppercase tracking-tight">Specialisation</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="label-mono">
                    Category
                  </label>
                  <select
                    id="category"
                    className={field}
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  >
                    <option value="">Choose a category</option>
                    {data.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="years" className="label-mono">
                    Years of experience
                  </label>
                  <input
                    id="years"
                    type="number"
                    min={0}
                    className={field}
                    value={form.years_experience}
                    onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="skills" className="label-mono">
                  Skills (comma separated)
                </label>
                <input
                  id="skills"
                  placeholder="React, TypeScript, Next.js, Tailwind"
                  className={field}
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="languages" className="label-mono">
                  Languages (comma separated)
                </label>
                <input
                  id="languages"
                  placeholder="English, Hindi"
                  className={field}
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                />
              </div>
            </div>

            <div className="glass rounded-2xl border border-border p-6">
              <h2 className="font-display text-2xl uppercase tracking-tight">
                Pricing &amp; availability
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="hourly" className="label-mono">
                    Hourly rate (₹)
                  </label>
                  <input
                    id="hourly"
                    type="number"
                    min={0}
                    className={field}
                    value={form.hourly_rate_inr}
                    onChange={(e) => setForm({ ...form, hourly_rate_inr: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="starting" className="label-mono">
                    Starting project price (₹)
                  </label>
                  <input
                    id="starting"
                    type="number"
                    min={0}
                    className={field}
                    value={form.starting_price_inr}
                    onChange={(e) => setForm({ ...form, starting_price_inr: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="availability" className="label-mono">
                    Availability
                  </label>
                  <select
                    id="availability"
                    className={field}
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  >
                    <option value="available">Available now</option>
                    <option value="limited">Limited availability</option>
                    <option value="unavailable">Not taking work</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="response" className="label-mono">
                    Typical response time (hours)
                  </label>
                  <input
                    id="response"
                    type="number"
                    min={1}
                    className={field}
                    value={form.response_time_hours}
                    onChange={(e) => setForm({ ...form, response_time_hours: e.target.value })}
                  />
                </div>
              </div>
              <label className="mt-5 flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="size-4 accent-[var(--primary)]"
                />
                Publish my profile to the public directory
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </form>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-5">
              <div className="glass-strong rounded-2xl border border-border p-6">
                <p className="label-mono">Profile Strength</p>
                <p className="mt-2 font-display text-5xl text-primary">{strength.score}/100</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent/60">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {strength.recommendations.length === 0 ? (
                    <li>Complete — your profile can be indexed by search engines.</li>
                  ) : (
                    strength.recommendations.map((r) => (
                      <li key={r} className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        {r}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              {data.freelancer?.slug && form.is_published && (
                <Link
                  to="/freelancer/$slug"
                  params={{ slug: data.freelancer.slug }}
                  className="block rounded-lg glass px-4 py-3 text-center text-sm font-semibold ring-1 ring-border"
                >
                  View public profile
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
