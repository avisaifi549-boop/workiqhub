import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Plan pricing is never shown publicly. Signed-in freelancers are sent to their
 * in-account subscription page; everyone else is sent to account creation.
 */
export const Route = createFileRoute("/pricing")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Plans — WorkIQHub" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/get-started" });
    throw redirect({ to: "/subscription" });
  },
  component: () => null,
});
