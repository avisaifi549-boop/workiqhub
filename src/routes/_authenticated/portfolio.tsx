import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccount } from "@/lib/account";
import { DashShell } from "@/components/dash/DashShell";
import { PortfolioEditor } from "@/components/dash/PortfolioEditor";

export const Route = createFileRoute("/_authenticated/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — WorkIQHub" },
      {
        name: "description",
        content: "Add and manage the real work shown on your public profile.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => fetchAccount(user!.id),
    enabled: !!user,
  });

  return (
    <DashShell
      role={data?.role ?? "freelancer"}
      title="Portfolio"
      subtitle="Work completed through WorkIQHub carries a verified badge automatically."
    >
      {user ? <PortfolioEditor userId={user.id} /> : null}
    </DashShell>
  );
}
