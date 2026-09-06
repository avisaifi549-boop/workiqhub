import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "@/components/site/EmptyState";
import { Field, GhostButton, PrimaryButton, Select, TagInput, TextArea, TextInput } from "./fields";
import { formatInr } from "@/lib/plans";

type PortfolioForm = {
  id?: string;
  title: string;
  description: string;
  category_id: string;
  skills: string[];
  technologies: string[];
  my_role: string;
  project_type: string;
  client_type: string;
  duration_weeks: string;
  budget_inr: string;
  image_url: string;
  project_url: string;
  outcome: string;
  contract_id: string;
};

const blank: PortfolioForm = {
  title: "",
  description: "",
  category_id: "",
  skills: [],
  technologies: [],
  my_role: "",
  project_type: "",
  client_type: "",
  duration_weeks: "",
  budget_inr: "",
  image_url: "",
  project_url: "",
  outcome: "",
  contract_id: "",
};

export function PortfolioEditor({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<PortfolioForm | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await supabase.from("categories").select("id, name").order("sort_order")).data ?? [],
  });

  /** Completed marketplace contracts are the only source of a verified badge. */
  const { data: completedContracts } = useQuery({
    queryKey: ["completed-contracts", userId],
    queryFn: async () =>
      (
        await supabase
          .from("contracts")
          .select("id, title")
          .eq("freelancer_id", userId)
          .eq("status", "completed")
      ).data ?? [],
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ["portfolio", userId],
    queryFn: async () =>
      (
        await supabase
          .from("portfolio_items")
          .select("*, categories(name)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  const save = useMutation({
    mutationFn: async (f: PortfolioForm) => {
      const payload = {
        user_id: userId,
        title: f.title.trim(),
        description: f.description.trim(),
        category_id: f.category_id || null,
        skills: f.skills,
        technologies: f.technologies,
        my_role: f.my_role || null,
        project_type: f.project_type || null,
        client_type: f.client_type || null,
        duration_weeks: f.duration_weeks ? Number(f.duration_weeks) : null,
        budget_inr: f.budget_inr ? Number(f.budget_inr) : null,
        image_url: f.image_url || null,
        project_url: f.project_url || null,
        outcome: f.outcome || null,
        contract_id: f.contract_id || null,
      };
      if (f.id) {
        const { error } = await supabase.from("portfolio_items").update(payload).eq("id", f.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("portfolio_items").insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Project saved");
      setForm(null);
      void qc.invalidateQueries({ queryKey: ["portfolio", userId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["portfolio", userId] }),
  });

  if (form) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim()) {
            toast.error("Give your project a title");
            return;
          }
          save.mutate(form);
        }}
        className="glass rounded-2xl border border-border p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Project title">
              <TextInput
                value={form.title}
                maxLength={100}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Description"
              hint="Describe the real work you did. Never claim clients, results or testimonials that aren't yours."
            >
              <TextArea
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          <Field label="My role" hint="e.g. Full stack developer">
            <TextInput
              value={form.my_role}
              onChange={(e) => setForm({ ...form, my_role: e.target.value })}
            />
          </Field>
          <Field label="Project type" hint="e.g. Website, mobile app, brand identity">
            <TextInput
              value={form.project_type}
              onChange={(e) => setForm({ ...form, project_type: e.target.value })}
            />
          </Field>
          <Field label="Client type (optional)" hint="e.g. Startup, agency — no names required">
            <TextInput
              value={form.client_type}
              onChange={(e) => setForm({ ...form, client_type: e.target.value })}
            />
          </Field>
          <Field label="Duration (weeks)">
            <TextInput
              type="number"
              min={1}
              value={form.duration_weeks}
              onChange={(e) => setForm({ ...form, duration_weeks: e.target.value })}
            />
          </Field>
          <Field label="Budget (₹, optional)">
            <TextInput
              type="number"
              min={0}
              value={form.budget_inr}
              onChange={(e) => setForm({ ...form, budget_inr: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Skills used">
              <TagInput values={form.skills} onChange={(skills) => setForm({ ...form, skills })} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Technologies / tools">
              <TagInput
                values={form.technologies}
                onChange={(technologies) => setForm({ ...form, technologies })}
              />
            </Field>
          </div>
          <Field label="Cover image URL">
            <TextInput
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </Field>
          <Field label="Project URL">
            <TextInput
              value={form.project_url}
              onChange={(e) => setForm({ ...form, project_url: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Outcome / results" hint="Only measurable results you can stand behind.">
              <TextArea
                rows={3}
                value={form.outcome}
                onChange={(e) => setForm({ ...form, outcome: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Was this completed through Loom?"
              hint="Linking a completed Loom project earns a verified badge. Everything else shows as a portfolio project."
            >
              <Select
                value={form.contract_id}
                onChange={(e) => setForm({ ...form, contract_id: e.target.value })}
              >
                <option value="">No — self-reported portfolio project</option>
                {(completedContracts ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    Yes — {c.title}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <PrimaryButton type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save project"}
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
        <PrimaryButton onClick={() => setForm(blank)}>+ Add portfolio project</PrimaryButton>
      </div>
      {isLoading ? (
        <div className="glass h-32 animate-pulse rounded-2xl border border-border" />
      ) : (items ?? []).length === 0 ? (
        <EmptyState
          title="You haven't added any portfolio projects yet"
          description="Showcase work you've already delivered. Projects completed through Loom get a verified badge automatically."
          action={
            <PrimaryButton onClick={() => setForm(blank)}>Add your first project</PrimaryButton>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(items ?? []).map((p) => (
            <article key={p.id} className="glass rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="label-mono">{p.categories?.name ?? "Project"}</p>
                <span
                  className={
                    p.is_verified
                      ? "rounded-md bg-primary/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-primary"
                      : "rounded-md bg-accent/50 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
                  }
                >
                  {p.is_verified ? "✓ Verified project" : "Portfolio project"}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
              {p.budget_inr ? <p className="mt-3 text-sm">{formatInr(p.budget_inr)}</p> : null}
              <div className="mt-5 flex gap-2">
                <GhostButton
                  onClick={() =>
                    setForm({
                      id: p.id,
                      title: p.title,
                      description: p.description,
                      category_id: p.category_id ?? "",
                      skills: p.skills ?? [],
                      technologies: p.technologies ?? [],
                      my_role: p.my_role ?? "",
                      project_type: p.project_type ?? "",
                      client_type: p.client_type ?? "",
                      duration_weeks: p.duration_weeks?.toString() ?? "",
                      budget_inr: p.budget_inr?.toString() ?? "",
                      image_url: p.image_url ?? "",
                      project_url: p.project_url ?? "",
                      outcome: p.outcome ?? "",
                      contract_id: p.contract_id ?? "",
                    })
                  }
                >
                  Edit
                </GhostButton>
                <GhostButton onClick={() => remove.mutate(p.id)}>Delete</GhostButton>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
