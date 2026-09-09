import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, SectionLabel } from "@/components/site/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/profile-strength";

export const Route = createFileRoute("/_authenticated/post-a-job")({
  head: () => ({
    meta: [
      { title: "Post a freelance project — WorkIQHub" },
      {
        name: "description",
        content: "Describe your project and get proposals from verified freelancers.",
      },
      { property: "og:title", content: "Post a freelance project — WorkIQHub" },
      {
        property: "og:description",
        content: "Describe your project and get proposals from verified freelancers.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PostJob,
});

const field =
  "mt-2 w-full rounded-lg border border-input bg-accent/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function PostJob() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    skills: "",
    budget_min_inr: "",
    budget_max_inr: "",
    timeline_weeks: "",
    project_type: "fixed",
    experience_level: "intermediate",
    location: "",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await supabase.from("categories").select("id, name").order("sort_order")).data ?? [],
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const slug = `${slugify(form.title)}-${Math.random().toString(36).slice(2, 7)}`;
      const { error } = await supabase.from("jobs").insert({
        client_id: user.id,
        title: form.title,
        slug,
        description: form.description,
        category_id: form.category_id || null,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        budget_min_inr: form.budget_min_inr ? Number(form.budget_min_inr) : null,
        budget_max_inr: form.budget_max_inr ? Number(form.budget_max_inr) : null,
        timeline_weeks: form.timeline_weeks ? Number(form.timeline_weeks) : null,
        project_type: form.project_type,
        experience_level: form.experience_level,
        location: form.location || null,
        status: "published",
      } as never);
      if (error) throw error;
      toast.success("Project published");
      navigate({ to: "/jobs/$slug", params: { slug } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish project");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <section className="py-12">
        <SectionLabel index="a">New project</SectionLabel>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-tight">Post a project</h1>
        <p className="mt-3 max-w-[52ch] text-muted-foreground">
          Clear briefs get better proposals. Include the outcome you want, not just the tasks.
        </p>

        <form onSubmit={submit} className="mt-10 max-w-3xl space-y-6">
          <div className="glass rounded-2xl border border-border p-6">
            <div>
              <label htmlFor="title" className="label-mono">
                Project title
              </label>
              <input
                id="title"
                required
                placeholder="Build a Shopify storefront for a skincare brand"
                className={field}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="label-mono">
                Brief
              </label>
              <textarea
                id="description"
                required
                rows={8}
                className={field}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
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
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="skills" className="label-mono">
                  Skills needed (comma separated)
                </label>
                <input
                  id="skills"
                  className={field}
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border border-border p-6">
            <h2 className="font-display text-2xl uppercase tracking-tight">Budget &amp; scope</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="min" className="label-mono">
                  Budget from (₹)
                </label>
                <input
                  id="min"
                  type="number"
                  min={0}
                  className={field}
                  value={form.budget_min_inr}
                  onChange={(e) => setForm({ ...form, budget_min_inr: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="max" className="label-mono">
                  Budget to (₹)
                </label>
                <input
                  id="max"
                  type="number"
                  min={0}
                  className={field}
                  value={form.budget_max_inr}
                  onChange={(e) => setForm({ ...form, budget_max_inr: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="weeks" className="label-mono">
                  Timeline (weeks)
                </label>
                <input
                  id="weeks"
                  type="number"
                  min={1}
                  className={field}
                  value={form.timeline_weeks}
                  onChange={(e) => setForm({ ...form, timeline_weeks: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="type" className="label-mono">
                  Project type
                </label>
                <select
                  id="type"
                  className={field}
                  value={form.project_type}
                  onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                >
                  <option value="fixed">Fixed price</option>
                  <option value="hourly">Hourly</option>
                  <option value="retainer">Retainer</option>
                </select>
              </div>
              <div>
                <label htmlFor="experience" className="label-mono">
                  Experience level
                </label>
                <select
                  id="experience"
                  className={field}
                  value={form.experience_level}
                  onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                >
                  <option value="entry">Entry</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label htmlFor="loc" className="label-mono">
                  Location preference
                </label>
                <input
                  id="loc"
                  placeholder="Remote / Mumbai"
                  className={field}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {busy ? "Publishing…" : "Publish project"}
          </button>
        </form>
      </section>
    </PageShell>
  );
}
