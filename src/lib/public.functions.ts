import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("categories")
    .select("id, slug, name, description")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listJobs = createServerFn({ method: "GET" })
  .inputValidator((d: { category?: string; q?: string; limit?: number } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    const sb = publicClient();
    let query = sb
      .from("jobs")
      .select(
        "id, title, slug, description, skills, budget_min_inr, budget_max_inr, timeline_weeks, project_type, experience_level, status, created_at, category_id, categories(name, slug)",
      )
      .in("status", ["published", "shortlisting", "interview"])
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 40);

    if (data.q) query = query.ilike("title", `%${data.q}%`);
    if (data.category) {
      const { data: cat } = await sb
        .from("categories")
        .select("id")
        .eq("slug", data.category)
        .maybeSingle();
      if (!cat) return [];
      query = query.eq("category_id", cat.id);
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getJob = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const { data: job, error } = await publicClient()
      .from("jobs")
      .select(
        "id, title, slug, description, skills, budget_min_inr, budget_max_inr, timeline_weeks, project_type, experience_level, location, status, created_at, client_id, categories(name, slug)",
      )
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return job;
  });

export const listFreelancers = createServerFn({ method: "GET" })
  .inputValidator(
    (d: { category?: string; q?: string; location?: string; limit?: number } | undefined) =>
      d ?? {},
  )
  .handler(async ({ data }) => {
    const sb = publicClient();
    let query = sb
      .from("freelancer_profiles")
      .select(
        "user_id, slug, headline, bio, skills, languages, hourly_rate_inr, starting_price_inr, availability, response_time_hours, years_experience, verification, plan, category_id, categories(name, slug), profiles(full_name, avatar_url, location)",
      )
      .eq("is_published", true)
      .limit(data.limit ?? 48);

    if (data.q) query = query.ilike("headline", `%${data.q}%`);
    if (data.category) {
      const { data: cat } = await sb
        .from("categories")
        .select("id")
        .eq("slug", data.category)
        .maybeSingle();
      if (!cat) return [];
      query = query.eq("category_id", cat.id);
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getFreelancer = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: profile, error } = await sb
      .from("freelancer_profiles")
      .select(
        "user_id, slug, headline, bio, skills, languages, hourly_rate_inr, starting_price_inr, availability, response_time_hours, years_experience, verification, plan, category_id, created_at, categories(name, slug), profiles(full_name, avatar_url, location)",
      )
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!profile) return null;

    const { data: portfolio } = await sb
      .from("portfolio_items")
      .select("id, title, description, image_url, project_url, outcome")
      .eq("user_id", profile.user_id)
      .order("sort_order");

    return { profile, portfolio: portfolio ?? [] };
  });

export const marketplaceCounts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [freelancers, jobs] = await Promise.all([
    sb.from("freelancer_profiles").select("user_id", { count: "exact", head: true }).eq("is_published", true),
    sb.from("jobs").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);
  return { freelancers: freelancers.count ?? 0, jobs: jobs.count ?? 0 };
});
