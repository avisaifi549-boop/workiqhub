import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { CATEGORY_GROUPS } from "@/lib/site/categories";
import { HIRE_PAGES } from "@/lib/site/hire";
import { GUIDES } from "@/lib/site/guides";

const STATIC_PATHS = [
  "/",
  "/freelancers",
  "/jobs",
  "/categories",
  "/why-us",
  "/about-us",
  "/faqs",
  "/contact",
  "/trust-and-safety",
  "/privacy",
  "/terms",
  "/help",
  "/help/disputes",
  "/careers",
  "/press",
  "/resources",
  "/resources/freelancers",
  "/resources/clients",
  "/guides",
  "/tools",
  "/tools/rate-calculator",
  "/tools/project-cost-calculator",
  "/tools/invoice-generator",
  "/tools/proposal-generator",
  "/tools/job-description-generator",
  "/tools/profile-score",
  "/get-started",
  ...CATEGORY_GROUPS.map((c) => `/categories/${c.slug}`),
  ...CATEGORY_GROUPS.map((c) => `/jobs/c/${c.slug}`),
  ...HIRE_PAGES.map((h) => `/hire/${h.slug}`),
  ...GUIDES.map((g) => `/guides/${g.slug}`),
];


export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
        const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
                h.delete("Authorization");
              h.set("apikey", key);
              return fetch(input, { ...init, headers: h });
            },
          },
        });

        const [categories, freelancers, jobs] = await Promise.all([
          supabase.from("categories").select("slug"),
          supabase.from("freelancer_profiles").select("slug, updated_at").eq("is_published", true),
          supabase.from("jobs").select("slug, updated_at").neq("status", "draft"),
        ]);

        const urls: Array<{ loc: string; lastmod?: string }> = [
          ...STATIC_PATHS.map((p) => ({ loc: `${origin}${p}` })),
          ...(categories.data ?? []).map((c) => ({ loc: `${origin}/freelancers/${c.slug}` })),
          ...(freelancers.data ?? []).map((f) => ({
            loc: `${origin}/freelancer/${f.slug}`,
            lastmod: f.updated_at as string,
          })),
          ...(jobs.data ?? []).map((j) => ({
            loc: `${origin}/jobs/${j.slug}`,
            lastmod: j.updated_at as string,
          })),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
