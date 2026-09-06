import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WizardShell } from "./Wizard";
import { Field, MultiChoice, Select, TagInput, TextArea, TextInput, ChoiceGrid } from "@/components/dash/fields";
import { ServiceEditor } from "@/components/dash/ServiceEditor";
import { PortfolioEditor } from "@/components/dash/PortfolioEditor";
import {
  AVAILABILITY,
  EMPLOYMENT_STATUS,
  EXPERIENCE_LEVELS,
  LANGUAGE_OPTIONS,
  PROJECT_SIZES,
} from "@/lib/marketplace";
import { profileStrength, slugify } from "@/lib/profile-strength";
import type { Account } from "@/lib/account";
import { saveFreelancerProfile, saveProfile } from "@/lib/account";

const TOTAL = 7;

export function FreelancerWizard({ userId, account }: { userId: string; account: Account }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const p = account.profile;
  const f = account.freelancer;

  const [step, setStep] = useState(Math.min(Math.max(p?.onboarding_step ?? 1, 1), TOTAL));
  const [busy, setBusy] = useState(false);

  const [fullName, setFullName] = useState(p?.full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(p?.avatar_url ?? "");
  const [headline, setHeadline] = useState(f?.headline ?? "");
  const [country, setCountry] = useState(p?.country ?? "India");
  const [city, setCity] = useState(p?.city ?? "");
  const [timezone, setTimezone] = useState(p?.timezone ?? "Asia/Kolkata");
  const [languages, setLanguages] = useState<string[]>(p?.languages ?? ["English"]);

  const [categoryId, setCategoryId] = useState(f?.category_id ?? "");
  const [skills, setSkills] = useState<string[]>(f?.skills ?? []);
  const [years, setYears] = useState(f?.years_experience?.toString() ?? "");
  const [experienceLevel, setExperienceLevel] = useState(f?.experience_level ?? "intermediate");
  const [employment, setEmployment] = useState(f?.employment_status ?? "full_time");
  const [bio, setBio] = useState(f?.bio ?? "");

  const [hourly, setHourly] = useState(f?.hourly_rate_inr?.toString() ?? "");
  const [minBudget, setMinBudget] = useState(f?.min_project_budget_inr?.toString() ?? "");
  const [startingPrice, setStartingPrice] = useState(f?.starting_price_inr?.toString() ?? "");
  const [availability, setAvailability] = useState(f?.availability ?? "open");
  const [projectSize, setProjectSize] = useState(f?.preferred_project_size ?? "medium");
  const [workingHours, setWorkingHours] = useState(f?.working_hours ?? "");

  const [education, setEducation] = useState<string[]>(
    Array.isArray(f?.education) ? (f?.education as string[]) : [],
  );
  const [certifications, setCertifications] = useState<string[]>(
    Array.isArray(f?.certifications) ? (f?.certifications as string[]) : [],
  );
  const [companies, setCompanies] = useState<string[]>(
    Array.isArray(f?.companies) ? (f?.companies as string[]) : [],
  );
  const [achievements, setAchievements] = useState(f?.achievements ?? "");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await supabase.from("categories").select("id, name").order("sort_order")).data ?? [],
  });

  const slug = f?.slug ?? `${slugify(fullName || "freelancer")}-${Math.random().toString(36).slice(2, 6)}`;

  const strength = profileStrength({
    headline,
    bio,
    skills,
    languages,
    hourly_rate_inr: hourly ? Number(hourly) : null,
    starting_price_inr: startingPrice ? Number(startingPrice) : null,
    category_id: categoryId || null,
    years_experience: years ? Number(years) : 0,
    avatar_url: avatarUrl || null,
    portfolioCount: account.portfolioCount,
  });

  async function persist(next: number, extra?: Record<string, unknown>) {
    setBusy(true);
    try {
      await saveProfile(userId, {
        full_name: fullName,
        avatar_url: avatarUrl || null,
        account_type: "freelancer",
        country,
        city,
        timezone,
        languages,
        location: [city, country].filter(Boolean).join(", "),
        onboarding_step: Math.min(next, TOTAL),
      });
      await saveFreelancerProfile(
        userId,
        {
          headline,
          bio,
          category_id: categoryId || null,
          skills,
          languages,
          years_experience: years ? Number(years) : null,
          experience_level: experienceLevel,
          employment_status: employment,
          hourly_rate_inr: hourly ? Number(hourly) : null,
          min_project_budget_inr: minBudget ? Number(minBudget) : null,
          starting_price_inr: startingPrice ? Number(startingPrice) : null,
          availability,
          preferred_project_size: projectSize,
          working_hours: workingHours || null,
          education,
          certifications,
          companies,
          achievements,
          ...extra,
        },
        slug,
      );
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
        title="Your basic profile"
        description="This is what clients see first."
        onNext={() => {
          if (!fullName.trim()) { toast.error("Add your full name"); return; }
          void persist(2);
        }}
        busy={busy}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>
          <Field label="Profile photo URL" hint="A clear headshot builds trust.">
            <TextInput value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field
              label={`Professional headline (${headline.length}/90)`}
              hint="Example: Full Stack Developer | React, Next.js & Node.js"
            >
              <TextInput
                value={headline}
                maxLength={90}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </Field>
            <div className="mt-3 rounded-lg border border-border bg-accent/30 p-4">
              <p className="label-mono">Live preview</p>
              <p className="mt-2 font-semibold">{fullName || "Your name"}</p>
              <p className="text-sm text-muted-foreground">
                {headline || "Your headline appears here"}
              </p>
            </div>
          </div>
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
        title="Professional information"
        onBack={back}
        onNext={() => {
          if (!categoryId) { toast.error("Pick your primary category"); return; }
          void persist(3);
        }}
        busy={busy}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary category">
            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Select a category</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Years of experience">
            <TextInput
              type="number"
              min={0}
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Skills" hint="Add at least 5 so matching works well.">
              <TagInput values={skills} onChange={setSkills} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Experience level">
              <ChoiceGrid
                options={EXPERIENCE_LEVELS}
                value={experienceLevel as never}
                onChange={(v) => setExperienceLevel(v)}
                columns={3}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Employment status">
              <ChoiceGrid
                options={EMPLOYMENT_STATUS}
                value={employment as never}
                onChange={(v) => setEmployment(v)}
                columns={3}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="About you" hint="200+ characters describing real experience.">
              <TextArea rows={6} value={bio} onChange={(e) => setBio(e.target.value)} />
            </Field>
          </div>
        </div>
      </WizardShell>
    );
  }

  if (step === 3) {
    return (
      <WizardShell
        step={3}
        total={TOTAL}
        title="Your services"
        description="Publish what clients can buy directly. You can add more any time."
        onBack={back}
        onNext={() => void persist(4)}
        onSkip={() => void persist(4)}
        busy={busy}
      >
        <ServiceEditor userId={userId} />
      </WizardShell>
    );
  }

  if (step === 4) {
    return (
      <WizardShell
        step={4}
        total={TOTAL}
        title="Portfolio projects"
        description="Show work you've delivered. This is separate from applying to client jobs."
        onBack={back}
        onNext={() => void persist(5)}
        onSkip={() => void persist(5)}
        busy={busy}
      >
        <PortfolioEditor userId={userId} />
      </WizardShell>
    );
  }

  if (step === 5) {
    return (
      <WizardShell
        step={5}
        total={TOTAL}
        title="Pricing & availability"
        onBack={back}
        onNext={() => void persist(6)}
        busy={busy}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Hourly rate (₹)">
            <TextInput
              type="number"
              min={0}
              value={hourly}
              onChange={(e) => setHourly(e.target.value)}
            />
          </Field>
          <Field label="Starting price (₹)">
            <TextInput
              type="number"
              min={0}
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
            />
          </Field>
          <Field label="Minimum project budget (₹)">
            <TextInput
              type="number"
              min={0}
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
          </Field>
          <Field label="Working hours" hint="e.g. 10:00–19:00 IST">
            <TextInput value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Availability">
              <ChoiceGrid
                options={AVAILABILITY}
                value={availability as never}
                onChange={(v) => setAvailability(v)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Preferred project size">
              <ChoiceGrid
                options={PROJECT_SIZES}
                value={projectSize as never}
                onChange={(v) => setProjectSize(v)}
                columns={4}
              />
            </Field>
          </div>
        </div>
      </WizardShell>
    );
  }

  if (step === 6) {
    return (
      <WizardShell
        step={6}
        total={TOTAL}
        title="Experience & credentials"
        description="All optional. Only add things that are genuinely yours."
        onBack={back}
        onNext={() => void persist(7)}
        onSkip={() => void persist(7)}
        busy={busy}
      >
        <div className="space-y-4">
          <Field label="Education">
            <TagInput
              values={education}
              onChange={setEducation}
              placeholder="B.Tech, Computer Science — press Enter"
            />
          </Field>
          <Field label="Certifications">
            <TagInput values={certifications} onChange={setCertifications} />
          </Field>
          <Field label="Previous companies">
            <TagInput values={companies} onChange={setCompanies} />
          </Field>
          <Field label="Professional achievements">
            <TextArea
              rows={4}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
            />
          </Field>
        </div>
      </WizardShell>
    );
  }

  return (
    <WizardShell
      step={7}
      total={TOTAL}
      title="Publish your profile"
      onBack={back}
      nextLabel="Publish my profile"
      onNext={async () => {
        await persist(7, { is_published: true });
        await saveProfile(userId, { onboarding_complete: true });
        await qc.invalidateQueries({ queryKey: ["account", userId] });
        toast.success("Your freelancer profile is live.");
        void navigate({ to: "/dashboard" });
      }}
      busy={busy}
    >
      <div className="flex flex-wrap items-center gap-6">
        <div className="text-center">
          <p className="font-display text-6xl text-primary">{strength.score}%</p>
          <p className="label-mono mt-1">Profile strength</p>
        </div>
        <div className="min-w-56 flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-accent/60">
            <div className="h-full bg-primary" style={{ width: `${strength.score}%` }} />
          </div>
          {strength.recommendations.length === 0 ? (
            <p className="mt-4 text-sm text-primary">Everything's in place. Publish away.</p>
          ) : (
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {strength.recommendations.map((r) => (
                <li key={r}>○ {r}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-6 rounded-lg border border-border bg-accent/30 p-4">
        <p className="label-mono">Your public profile URL</p>
        <p className="mt-2 font-mono text-sm break-all text-primary">/freelancer/{slug}</p>
      </div>
    </WizardShell>
  );
}
