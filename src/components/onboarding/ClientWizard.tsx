import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WizardShell } from "./Wizard";
import { ChoiceGrid, Field, MultiChoice, TextArea, TextInput } from "@/components/dash/fields";
import {
  CLIENT_TYPES,
  HIRE_FREQUENCY,
  LANGUAGE_OPTIONS,
  PREFERRED_EXPERIENCE,
  TYPICAL_BUDGETS,
  labelOf,
} from "@/lib/marketplace";
import type { Account } from "@/lib/account";
import { saveClientProfile, saveProfile } from "@/lib/account";

const TOTAL = 6;

export function ClientWizard({ userId, account }: { userId: string; account: Account }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const p = account.profile;
  const c = account.client;

  const [step, setStep] = useState(Math.min(Math.max(p?.onboarding_step ?? 1, 1), TOTAL));
  const [busy, setBusy] = useState(false);

  const [fullName, setFullName] = useState(p?.full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(p?.avatar_url ?? "");
  const [country, setCountry] = useState(p?.country ?? "India");
  const [city, setCity] = useState(p?.city ?? "");
  const [timezone, setTimezone] = useState(p?.timezone ?? "Asia/Kolkata");
  const [languages, setLanguages] = useState<string[]>(p?.languages ?? ["English"]);

  const [clientType, setClientType] = useState(c?.client_type ?? "individual");
  const [needs, setNeeds] = useState<string[]>(c?.need_categories ?? []);
  const [frequency, setFrequency] = useState(c?.hire_frequency ?? "first_time");
  const [companyName, setCompanyName] = useState(c?.company_name ?? "");
  const [companyWebsite, setCompanyWebsite] = useState(c?.company_website ?? "");
  const [companySize, setCompanySize] = useState(c?.company_size ?? "");
  const [industry, setIndustry] = useState(c?.industry ?? "");
  const [companyDescription, setCompanyDescription] = useState(c?.company_description ?? "");
  const [companyLogo, setCompanyLogo] = useState(c?.company_logo_url ?? "");
  const [budget, setBudget] = useState(c?.typical_budget ?? "under_10k");
  const [preferredExperience, setPreferredExperience] = useState(
    c?.preferred_experience ?? "no_preference",
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await supabase.from("categories").select("id, slug, name").order("sort_order")).data ?? [],
  });

  async function persist(next: number, complete = false) {
    setBusy(true);
    try {
      await saveProfile(userId, {
        full_name: fullName,
        avatar_url: avatarUrl || null,
        account_type: "client",
        country,
        city,
        timezone,
        languages,
        location: [city, country].filter(Boolean).join(", "),
        onboarding_step: Math.min(next, TOTAL),
        ...(complete ? { onboarding_complete: true } : {}),
      });
      await saveClientProfile(userId, {
        client_type: clientType,
        need_categories: needs,
        hire_frequency: frequency,
        company_name: companyName || null,
        company_website: companyWebsite || null,
        company_size: companySize || null,
        industry: industry || null,
        company_description: companyDescription || null,
        company_logo_url: companyLogo || null,
        typical_budget: budget,
        preferred_experience: preferredExperience,
      });
      await qc.invalidateQueries({ queryKey: ["account", userId] });
      setStep(Math.min(next, TOTAL));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  const back = step > 1 ? () => setStep(step - 1) : undefined;

  if (step === 1) {
    return (
      <WizardShell
        step={1}
        total={TOTAL}
        title="Basic information"
        onNext={() => {
          if (!fullName.trim()) {
            toast.error("Add your full name");
            return;
          }
          void persist(2);
        }}
        busy={busy}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field label="Profile photo URL">
            <TextInput value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </Field>
          <Field label="Country">
            <TextInput value={country} onChange={(e) => setCountry(e.target.value)} />
          </Field>
          <Field label="City">
            <TextInput value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
          <Field label="Timezone">
            <TextInput value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Languages">
              <MultiChoice
                options={LANGUAGE_OPTIONS.map((l) => ({ value: l, label: l }))}
                values={languages}
                onChange={setLanguages}
              />
            </Field>
          </div>
        </div>
      </WizardShell>
    );
  }

  if (step === 2) {
    return (
      <WizardShell
        step={2}
        total={TOTAL}
        title="What best describes you?"
        onBack={back}
        onNext={() => void persist(3)}
        busy={busy}
      >
        <ChoiceGrid
          options={CLIENT_TYPES}
          value={clientType as never}
          onChange={(v) => setClientType(v)}
          columns={3}
        />
      </WizardShell>
    );
  }

  if (step === 3) {
    return (
      <WizardShell
        step={3}
        total={TOTAL}
        title="What do you need help with?"
        onBack={back}
        onNext={() => void persist(4)}
        busy={busy}
      >
        <Field label="Categories you hire for">
          <MultiChoice
            options={(categories ?? []).map((c) => ({ value: c.slug, label: c.name }))}
            values={needs}
            onChange={setNeeds}
          />
        </Field>
        <div className="mt-6">
          <Field label="How often do you hire freelancers?">
            <ChoiceGrid
              options={HIRE_FREQUENCY}
              value={frequency as never}
              onChange={(v) => setFrequency(v)}
              columns={4}
            />
          </Field>
        </div>
      </WizardShell>
    );
  }

  if (step === 4) {
    return (
      <WizardShell
        step={4}
        total={TOTAL}
        title="Company information"
        description="Optional — skip this if you're hiring as an individual."
        onBack={back}
        onNext={() => void persist(5)}
        onSkip={() => void persist(5)}
        busy={busy}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name">
            <TextInput value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </Field>
          <Field label="Website">
            <TextInput value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
          </Field>
          <Field label="Company size">
            <TextInput value={companySize} onChange={(e) => setCompanySize(e.target.value)} />
          </Field>
          <Field label="Industry">
            <TextInput value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </Field>
          <Field label="Company logo URL">
            <TextInput value={companyLogo} onChange={(e) => setCompanyLogo(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Company description">
              <TextArea
                rows={4}
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </WizardShell>
    );
  }

  if (step === 5) {
    return (
      <WizardShell
        step={5}
        total={TOTAL}
        title="Hiring preferences"
        onBack={back}
        onNext={() => void persist(6)}
        busy={busy}
      >
        <Field label="Typical project budget">
          <ChoiceGrid
            options={TYPICAL_BUDGETS}
            value={budget as never}
            onChange={(v) => setBudget(v)}
            columns={3}
          />
        </Field>
        <div className="mt-6">
          <Field label="Preferred freelancer experience">
            <ChoiceGrid
              options={PREFERRED_EXPERIENCE}
              value={preferredExperience as never}
              onChange={(v) => setPreferredExperience(v)}
              columns={4}
            />
          </Field>
        </div>
      </WizardShell>
    );
  }

  return (
    <WizardShell
      step={6}
      total={TOTAL}
      title="Your client profile"
      nextLabel="Complete profile"
      onBack={back}
      onNext={async () => {
        await persist(6, true);
        toast.success("Your client profile is ready.");
        void navigate({ to: "/dashboard" });
      }}
      busy={busy}
    >
      <div className="space-y-3 text-sm">
        <Row label="Name" value={fullName} />
        <Row label="Location" value={[city, country].filter(Boolean).join(", ") || "—"} />
        <Row label="Client type" value={labelOf(CLIENT_TYPES, clientType)} />
        <Row label="Hires" value={labelOf(HIRE_FREQUENCY, frequency)} />
        <Row label="Typical budget" value={labelOf(TYPICAL_BUDGETS, budget)} />
        <Row label="Prefers" value={labelOf(PREFERRED_EXPERIENCE, preferredExperience)} />
        <Row label="Needs" value={needs.length ? needs.join(", ") : "—"} />
        {companyName && <Row label="Company" value={companyName} />}
      </div>
    </WizardShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-border pb-2">
      <span className="label-mono">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
