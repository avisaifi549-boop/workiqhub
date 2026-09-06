import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const STATIC_PATHS = ["/", "/freelancers", "/jobs", "/pricing"];

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
