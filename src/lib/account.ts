import { supabase } from "@/integrations/supabase/client";

export type AccountRole = "freelancer" | "client";

/** Everything the authenticated shell needs about the current user. */
export async function fetchAccount(userId: string) {
  const [profileRes, freelancerRes, clientRes, portfolioRes, servicesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("freelancer_profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("client_profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("portfolio_items").select("id").eq("user_id", userId),
    supabase.from("services").select("id").eq("freelancer_id", userId),
  ]);

  return {
    profile: profileRes.data,
    freelancer: freelancerRes.data,
    client: clientRes.data,
    portfolioCount: portfolioRes.data?.length ?? 0,
    serviceCount: servicesRes.data?.length ?? 0,
    role: (profileRes.data?.account_type ?? "freelancer") as AccountRole,
  };
}

export type Account = Awaited<ReturnType<typeof fetchAccount>>;

export async function saveProfile(userId: string, patch: Record<string, unknown>) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...patch }, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

export async function saveFreelancerProfile(
  userId: string,
  patch: Record<string, unknown>,
  slug: string,
) {
  const { error } = await supabase
    .from("freelancer_profiles")
    .upsert({ user_id: userId, slug, ...patch }, { onConflict: "user_id" });
  if (error) throw new Error(error.message);
}

export async function saveClientProfile(userId: string, patch: Record<string, unknown>) {
  const { error } = await supabase
    .from("client_profiles")
    .upsert({ user_id: userId, ...patch }, { onConflict: "user_id" });
  if (error) throw new Error(error.message);
}

/** Contracts where the user is a party, newest first. */
export async function fetchContracts(userId: string) {
  const { data, error } = await supabase
    .from("contracts")
    .select(
      "id, title, description, amount_inr, deadline, status, completed_at, created_at, client_id, freelancer_id, jobs(title, slug)",
    )
    .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
