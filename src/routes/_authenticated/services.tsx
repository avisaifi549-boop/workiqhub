import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccount } from "@/lib/account";
import { DashShell } from "@/components/dash/DashShell";
import { ServiceEditor } from "@/components/dash/ServiceEditor";

export const Route = createFileRoute("/_authenticated/services")({
  head: () => ({
    meta: [
      { title: "My services — WorkIQHub" },
      { name: "description", content: "Create and manage the services clients can hire you for." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["account", user?.id],
    queryFn: () => fetchAccount(user!.id),
    enabled: !!user,
  });

  return (
    <DashShell
      role={data?.role ?? "freelancer"}
      title="My services"
      subtitle="Packaged work clients can buy directly from your profile."
    >
      {user ? <ServiceEditor userId={user.id} /> : null}
    </DashShell>
  );
}
