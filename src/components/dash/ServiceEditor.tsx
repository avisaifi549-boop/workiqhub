import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "@/components/site/EmptyState";
import { Field, GhostButton, PrimaryButton, Select, TagInput, TextArea, TextInput } from "./fields";
import { PRICING_TYPES } from "@/lib/marketplace";
import { formatInr } from "@/lib/plans";
import { slugify } from "@/lib/profile-strength";

type ServiceForm = {
  id?: string;
  title: string;
  category_id: string;
  description: string;
  skills: string[];
  starting_price_inr: string;
  pricing_type: string;
  delivery_days: string;
};

const blank: ServiceForm = {
  title: "",
  category_id: "",
  description: "",
  skills: [],
  starting_price_inr: "",
  pricing_type: "fixed",
  delivery_days: "",
};

export function ServiceEditor({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<ServiceForm | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await supabase.from("categories").select("id, name").order("sort_order")).data ?? [],
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ["services", userId],
    queryFn: async () =>
      (
        await supabase
          .from("services")
          .select("*, categories(name)")
          .eq("freelancer_id", userId)
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  const save = useMutation({
    mutationFn: async (f: ServiceForm) => {
      const payload = {
        freelancer_id: userId,
        title: f.title.trim(),
        category_id: f.category_id || null,
        description: f.description.trim(),
        skills: f.skills,
        starting_price_inr: f.starting_price_inr ? Number(f.starting_price_inr) : null,
        pricing_type: f.pricing_type,
        delivery_days: f.delivery_days ? Number(f.delivery_days) : null,
      };
      if (f.id) {
        const { error } = await supabase.from("services").update(payload).eq("id", f.id);
        if (error) throw new Error(error.message);
      } else {
        const slug = `${slugify(f.title)}-${Math.random().toString(36).slice(2, 7)}`;
        const { error } = await supabase.from("services").insert({ ...payload, slug });
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Service saved");
      setForm(null);
      void qc.invalidateQueries({ queryKey: ["services", userId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["services", userId] }),
  });

  if (form) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim()) return toast.error("Give your service a title");
          save.mutate(form);
        }}
        className="glass rounded-2xl border border-border p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Service title" hint="e.g. WordPress business website">
              <TextInput
                value={form.title}
                maxLength={90}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Category">
            <Select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Select a category</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Pricing type">
            <Select
              value={form.pricing_type}
              onChange={(e) => setForm({ ...form, pricing_type: e.target.value })}
            >
              {PRICING_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Starting price (₹)">
            <TextInput
              type="number"
              min={0}
              value={form.starting_price_inr}
              onChange={(e) => setForm({ ...form, starting_price_inr: e.target.value })}
            />
          </Field>
          <Field label="Delivery time (days)">
            <TextInput
              type="number"
              min={1}
              value={form.delivery_days}
              onChange={(e) => setForm({ ...form, delivery_days: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="What's included">
              <TextArea
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Skills">
              <TagInput
                values={form.skills}
                onChange={(skills) => setForm({ ...form, skills })}
                placeholder="Add a skill and press Enter"
              />
            </Field>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <PrimaryButton type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save service"}
          </PrimaryButton>
          <GhostButton type="button" onClick={() => setForm(null)}>
            Cancel
          </GhostButton>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <PrimaryButton onClick={() => setForm(blank)}>+ Add service</PrimaryButton>
      </div>
      {isLoading ? (
        <div className="glass h-32 animate-pulse rounded-2xl border border-border" />
      ) : (services ?? []).length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Publish what you offer so clients can hire you directly, without waiting for a job post."
          action={<PrimaryButton onClick={() => setForm(blank)}>Add your first service</PrimaryButton>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(services ?? []).map((s) => (
            <article key={s.id} className="glass rounded-2xl border border-border p-5">
              <p className="label-mono">{s.categories?.name ?? "Service"}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-md bg-accent/50 px-2 py-1">
                  {s.starting_price_inr ? `From ${formatInr(s.starting_price_inr)}` : "Custom quote"}
                </span>
                {s.delivery_days && (
                  <span className="rounded-md bg-accent/50 px-2 py-1">{s.delivery_days} days</span>
                )}
              </div>
              <div className="mt-5 flex gap-2">
                <GhostButton
                  onClick={() =>
                    setForm({
                      id: s.id,
                      title: s.title,
                      category_id: s.category_id ?? "",
                      description: s.description,
                      skills: s.skills ?? [],
                      starting_price_inr: s.starting_price_inr?.toString() ?? "",
                      pricing_type: s.pricing_type,
                      delivery_days: s.delivery_days?.toString() ?? "",
                    })
                  }
                >
                  Edit
                </GhostButton>
                <GhostButton onClick={() => remove.mutate(s.id)}>Delete</GhostButton>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
