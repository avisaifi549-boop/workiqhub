-- ============ ENUMS ============
CREATE TYPE public.contract_status AS ENUM ('hired','contracted','milestone_funded','in_progress','submitted','revision_requested','completed','cancelled','disputed');
CREATE TYPE public.milestone_status AS ENUM ('pending','funded','submitted','approved','released','cancelled');
CREATE TYPE public.review_direction AS ENUM ('client_to_freelancer','freelancer_to_client');

-- ============ PROFILES: onboarding + shared fields ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS timezone text,
  ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_step integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false;

-- ============ FREELANCER PROFILES: extra fields ============
ALTER TABLE public.freelancer_profiles
  ADD COLUMN IF NOT EXISTS experience_level text NOT NULL DEFAULT 'intermediate',
  ADD COLUMN IF NOT EXISTS employment_status text NOT NULL DEFAULT 'full_time',
  ADD COLUMN IF NOT EXISTS min_project_budget_inr integer,
  ADD COLUMN IF NOT EXISTS preferred_project_size text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS working_hours text,
  ADD COLUMN IF NOT EXISTS education jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS companies jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS achievements text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false;

ALTER TABLE public.freelancer_profiles
  DROP CONSTRAINT IF EXISTS fp_experience_level_chk,
  DROP CONSTRAINT IF EXISTS fp_employment_status_chk,
  DROP CONSTRAINT IF EXISTS fp_project_size_chk,
  DROP CONSTRAINT IF EXISTS fp_availability_chk;
UPDATE public.freelancer_profiles
  SET availability = CASE
    WHEN availability IN ('open','this_week','busy','closed') THEN availability
    WHEN availability ILIKE '%week%' THEN 'this_week'
    WHEN availability ILIKE '%busy%' THEN 'busy'
    WHEN availability ILIKE '%not%' OR availability ILIKE '%closed%' THEN 'closed'
    ELSE 'open' END;

ALTER TABLE public.freelancer_profiles
  ADD CONSTRAINT fp_experience_level_chk CHECK (experience_level IN ('beginner','intermediate','expert')),
  ADD CONSTRAINT fp_employment_status_chk CHECK (employment_status IN ('full_time','part_time','agency','student','other')),
  ADD CONSTRAINT fp_project_size_chk CHECK (preferred_project_size IN ('small','medium','large','enterprise')),
  ADD CONSTRAINT fp_availability_chk CHECK (availability IN ('open','this_week','busy','closed'));

-- ============ CLIENT PROFILES ============
CREATE TABLE IF NOT EXISTS public.client_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_type text NOT NULL DEFAULT 'individual' CHECK (client_type IN ('individual','startup','small_business','medium_business','enterprise','agency','other')),
  need_categories text[] NOT NULL DEFAULT '{}',
  hire_frequency text NOT NULL DEFAULT 'first_time' CHECK (hire_frequency IN ('first_time','occasionally','monthly','frequently')),
  company_name text,
  company_website text,
  company_size text,
  industry text,
  company_description text,
  company_logo_url text,
  typical_budget text NOT NULL DEFAULT 'under_10k' CHECK (typical_budget IN ('under_10k','10k_50k','50k_1l','1l_5l','5l_plus')),
  preferred_experience text NOT NULL DEFAULT 'no_preference' CHECK (preferred_experience IN ('beginner','intermediate','expert','no_preference')),
  payment_verified boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_profiles TO authenticated;
GRANT SELECT ON public.client_profiles TO anon;
GRANT ALL ON public.client_profiles TO service_role;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY client_profiles_public_read ON public.client_profiles FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY client_profiles_owner_read ON public.client_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY client_profiles_owner_write ON public.client_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER client_profiles_updated_at BEFORE UPDATE ON public.client_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SERVICES ============
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid NOT NULL REFERENCES public.freelancer_profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  description text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}',
  starting_price_inr integer,
  pricing_type text NOT NULL DEFAULT 'fixed' CHECK (pricing_type IN ('fixed','hourly','custom')),
  delivery_days integer,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT SELECT ON public.services TO anon;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY services_public_read ON public.services FOR SELECT TO anon, authenticated USING (
  is_published = true AND EXISTS (SELECT 1 FROM public.freelancer_profiles f WHERE f.user_id = services.freelancer_id AND f.is_published)
);
CREATE POLICY services_owner_read ON public.services FOR SELECT TO authenticated USING (auth.uid() = freelancer_id);
CREATE POLICY services_owner_write ON public.services FOR ALL TO authenticated USING (auth.uid() = freelancer_id) WITH CHECK (auth.uid() = freelancer_id);
CREATE INDEX IF NOT EXISTS services_freelancer_idx ON public.services(freelancer_id);
CREATE INDEX IF NOT EXISTS services_category_idx ON public.services(category_id);
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ CONTRACTS (real marketplace projects) ============
CREATE TABLE IF NOT EXISTS public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  application_id uuid REFERENCES public.applications(id) ON DELETE SET NULL,
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  freelancer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  amount_inr integer NOT NULL DEFAULT 0,
  deadline date,
  status public.contract_status NOT NULL DEFAULT 'hired',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contracts_distinct_parties CHECK (client_id <> freelancer_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY contracts_party_read ON public.contracts FOR SELECT TO authenticated USING (auth.uid() IN (client_id, freelancer_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY contracts_client_insert ON public.contracts FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY contracts_party_update ON public.contracts FOR UPDATE TO authenticated USING (auth.uid() IN (client_id, freelancer_id)) WITH CHECK (auth.uid() IN (client_id, freelancer_id));
CREATE INDEX IF NOT EXISTS contracts_client_idx ON public.contracts(client_id);
CREATE INDEX IF NOT EXISTS contracts_freelancer_idx ON public.contracts(freelancer_id);
CREATE TRIGGER contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ MILESTONES ============
CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount_inr integer NOT NULL DEFAULT 0,
  due_date date,
  status public.milestone_status NOT NULL DEFAULT 'pending',
  sort_order integer NOT NULL DEFAULT 0,
  submitted_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.milestones TO authenticated;
GRANT ALL ON public.milestones TO service_role;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY milestones_party_read ON public.milestones FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.contracts c WHERE c.id = milestones.contract_id AND (auth.uid() IN (c.client_id, c.freelancer_id) OR public.has_role(auth.uid(),'admin')))
);
CREATE POLICY milestones_client_write ON public.milestones FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.contracts c WHERE c.id = milestones.contract_id AND c.client_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.contracts c WHERE c.id = milestones.contract_id AND c.client_id = auth.uid())
);
CREATE POLICY milestones_freelancer_update ON public.milestones FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.contracts c WHERE c.id = milestones.contract_id AND c.freelancer_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.contracts c WHERE c.id = milestones.contract_id AND c.freelancer_id = auth.uid())
);
CREATE INDEX IF NOT EXISTS milestones_contract_idx ON public.milestones(contract_id);
CREATE TRIGGER milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PORTFOLIO PROJECTS (extend existing) ============
ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS skills text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS technologies text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS my_role text,
  ADD COLUMN IF NOT EXISTS project_type text,
  ADD COLUMN IF NOT EXISTS client_type text,
  ADD COLUMN IF NOT EXISTS duration_weeks integer,
  ADD COLUMN IF NOT EXISTS budget_inr integer,
  ADD COLUMN IF NOT EXISTS contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE TRIGGER portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- A portfolio item may only be marked verified when it points at a completed
-- marketplace contract the freelancer actually delivered.
CREATE OR REPLACE FUNCTION public.enforce_portfolio_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.contract_id IS NULL THEN
    NEW.is_verified := false;
  ELSE
    NEW.is_verified := EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = NEW.contract_id
        AND c.freelancer_id = NEW.user_id
        AND c.status = 'completed'
    );
    IF NOT NEW.is_verified THEN NEW.contract_id := NULL; END IF;
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.enforce_portfolio_verification() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER portfolio_verification BEFORE INSERT OR UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_portfolio_verification();

-- ============ REVIEWS ============
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  direction public.review_direction NOT NULL,
  rating numeric(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  communication numeric(2,1) CHECK (communication >= 1 AND communication <= 5),
  quality numeric(2,1) CHECK (quality >= 1 AND quality <= 5),
  timeliness numeric(2,1) CHECK (timeliness >= 1 AND timeliness <= 5),
  professionalism numeric(2,1) CHECK (professionalism >= 1 AND professionalism <= 5),
  value_for_money numeric(2,1) CHECK (value_for_money >= 1 AND value_for_money <= 5),
  is_hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_no_self CHECK (reviewer_id <> reviewee_id),
  CONSTRAINT reviews_one_per_party UNIQUE (contract_id, reviewer_id)
);
GRANT SELECT, INSERT, UPDATE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY reviews_public_read ON public.reviews FOR SELECT TO anon, authenticated USING (is_hidden = false);
CREATE POLICY reviews_reviewer_insert ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY reviews_reviewer_update ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = reviewer_id) WITH CHECK (auth.uid() = reviewer_id);
CREATE INDEX IF NOT EXISTS reviews_reviewee_idx ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS reviews_contract_idx ON public.reviews(contract_id);
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Review integrity: only a party of a COMPLETED contract may review the other party.
CREATE OR REPLACE FUNCTION public.enforce_review_integrity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c public.contracts%ROWTYPE;
BEGIN
  SELECT * INTO c FROM public.contracts WHERE id = NEW.contract_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Review must reference an existing project'; END IF;
  IF c.status <> 'completed' THEN RAISE EXCEPTION 'Reviews are only allowed on completed projects'; END IF;
  IF NEW.reviewer_id = c.client_id THEN
    NEW.reviewee_id := c.freelancer_id;
    NEW.direction := 'client_to_freelancer';
  ELSIF NEW.reviewer_id = c.freelancer_id THEN
    NEW.reviewee_id := c.client_id;
    NEW.direction := 'freelancer_to_client';
  ELSE
    RAISE EXCEPTION 'Only the client or freelancer on this project can leave a review';
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.enforce_review_integrity() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER reviews_integrity BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.enforce_review_integrity();

-- ============ SAVED FREELANCERS ============
CREATE TABLE IF NOT EXISTS public.saved_freelancers (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  freelancer_id uuid NOT NULL REFERENCES public.freelancer_profiles(user_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, freelancer_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_freelancers TO authenticated;
GRANT ALL ON public.saved_freelancers TO service_role;
ALTER TABLE public.saved_freelancers ENABLE ROW LEVEL SECURITY;
CREATE POLICY saved_freelancers_own ON public.saved_freelancers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_own ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications(user_id, created_at DESC);

-- ============ REPORTS ============
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('review','profile','job','service','portfolio_item','message')),
  target_id uuid NOT NULL,
  reason text NOT NULL,
  details text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewing','resolved','dismissed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY reports_own_read ON public.reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY reports_insert ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE INDEX IF NOT EXISTS reports_target_idx ON public.reports(target_type, target_id);
