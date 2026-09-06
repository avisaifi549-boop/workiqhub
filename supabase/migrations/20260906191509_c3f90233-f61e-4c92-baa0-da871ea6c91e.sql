-- enums
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
CREATE TYPE public.account_type AS ENUM ('freelancer','client');
CREATE TYPE public.job_status AS ENUM ('draft','published','shortlisting','interview','hired','in_progress','completed','cancelled','disputed');
CREATE TYPE public.application_status AS ENUM ('submitted','shortlisted','interview','hired','rejected','withdrawn');
CREATE TYPE public.verification_level AS ENUM ('none','identity_verified','skill_verified','top_talent');
CREATE TYPE public.plan_tier AS ENUM ('free','starter','pro','elite');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  account_type public.account_type NOT NULL DEFAULT 'freelancer',
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE POLICY "user_roles_read_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- new user handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, account_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'account_type')::public.account_type, 'freelancer')
  )
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.categories (slug, name, description, sort_order) VALUES
 ('web-developers','Web Developers','Frontend, backend and full-stack web engineers.',1),
 ('react-developers','React Developers','Specialists in React, Next.js and modern frontends.',2),
 ('app-developers','App Developers','iOS, Android and cross-platform mobile developers.',3),
 ('ui-ux-designers','UI/UX Designers','Product, interface and experience designers.',4),
 ('graphic-designers','Graphic Designers','Brand, logo and visual identity designers.',5),
 ('seo-experts','SEO Experts','Search, technical SEO and organic growth specialists.',6),
 ('content-writers','Content Writers','Copywriters, editors and content strategists.',7),
 ('video-editors','Video Editors','Editing, motion graphics and post-production.',8),
 ('python-developers','Python Developers','Backend, data and automation engineers.',9),
 ('shopify-developers','Shopify Developers','Shopify themes, apps and store builds.',10),
 ('wordpress-developers','WordPress Developers','Themes, plugins and WooCommerce builds.',11);

-- freelancer profiles
CREATE TABLE public.freelancer_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  headline TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  category_id UUID REFERENCES public.categories ON DELETE SET NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate_inr INT,
  starting_price_inr INT,
  availability TEXT NOT NULL DEFAULT 'open',
  response_time_hours INT,
  years_experience INT,
  verification public.verification_level NOT NULL DEFAULT 'none',
  plan public.plan_tier NOT NULL DEFAULT 'free',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX freelancer_profiles_published_idx ON public.freelancer_profiles (is_published);
CREATE INDEX freelancer_profiles_category_idx ON public.freelancer_profiles (category_id);
CREATE INDEX freelancer_profiles_skills_idx ON public.freelancer_profiles USING GIN (skills);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.freelancer_profiles TO authenticated;
GRANT SELECT ON public.freelancer_profiles TO anon;
GRANT ALL ON public.freelancer_profiles TO service_role;
ALTER TABLE public.freelancer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fp_public_read" ON public.freelancer_profiles FOR SELECT USING (is_published = true);
CREATE POLICY "fp_owner_read" ON public.freelancer_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "fp_owner_write" ON public.freelancer_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER fp_updated_at BEFORE UPDATE ON public.freelancer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- portfolio
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  project_url TEXT,
  outcome TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX portfolio_items_user_idx ON public.portfolio_items (user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT SELECT ON public.portfolio_items TO anon;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_public_read" ON public.portfolio_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.freelancer_profiles f WHERE f.user_id = portfolio_items.user_id AND f.is_published));
CREATE POLICY "portfolio_owner_read" ON public.portfolio_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "portfolio_owner_write" ON public.portfolio_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- jobs
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  category_id UUID REFERENCES public.categories ON DELETE SET NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  budget_min_inr INT,
  budget_max_inr INT,
  timeline_weeks INT,
  project_type TEXT NOT NULL DEFAULT 'fixed',
  experience_level TEXT NOT NULL DEFAULT 'intermediate',
  location TEXT,
  status public.job_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX jobs_status_idx ON public.jobs (status, created_at DESC);
CREATE INDEX jobs_category_idx ON public.jobs (category_id);
CREATE INDEX jobs_skills_idx ON public.jobs USING GIN (skills);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT SELECT ON public.jobs TO anon;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs_public_read" ON public.jobs FOR SELECT USING (status <> 'draft');
CREATE POLICY "jobs_owner_read" ON public.jobs FOR SELECT TO authenticated USING (auth.uid() = client_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "jobs_owner_write" ON public.jobs FOR ALL TO authenticated USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);
CREATE TRIGGER jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  cover_letter TEXT NOT NULL DEFAULT '',
  bid_amount_inr INT,
  delivery_days INT,
  status public.application_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, freelancer_id)
);
CREATE INDEX applications_job_idx ON public.applications (job_id);
CREATE INDEX applications_freelancer_idx ON public.applications (freelancer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "applications_freelancer_read" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = freelancer_id);
CREATE POLICY "applications_client_read" ON public.applications FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.client_id = auth.uid()));
CREATE POLICY "applications_freelancer_write" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "applications_freelancer_update" ON public.applications FOR UPDATE TO authenticated USING (auth.uid() = freelancer_id) WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "applications_client_update" ON public.applications FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.client_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.jobs j WHERE j.id = applications.job_id AND j.client_id = auth.uid()));
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- saved jobs
CREATE TABLE public.saved_jobs (
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, job_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_jobs TO authenticated;
GRANT ALL ON public.saved_jobs TO service_role;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saved_jobs_own" ON public.saved_jobs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);