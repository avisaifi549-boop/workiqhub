import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccount } from "@/lib/account";
import { FreelancerWizard } from "@/components/onboarding/FreelancerWizard";
import { ClientWizard } from "@/components/onboarding/ClientWizard";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your Loom profile" },
      { name: "description", content: "Complete your Loom profile to start hiring or freelancing." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => fetchAccount(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (data?.profile?.onboarding_complete) void navigate({ to: "/dashboard", replace: true });
  }, [data?.profile?.onboarding_complete, navigate]);

  if (loading || isLoading || !user || !data) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="glass h-80 animate-pulse rounded-2xl border border-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -top-40 -right-24 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
      <SiteHeader />
      <div className="relative">
        {data.role === "client" ? (
          <ClientWizard userId={user.id} account={data} />
        ) : (
          <FreelancerWizard userId={user.id} account={data} />
        )}
      </div>
    </div>
  );
}
