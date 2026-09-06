ALTER TABLE public.freelancer_profiles
  ADD CONSTRAINT freelancer_profiles_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.portfolio_items
  ADD CONSTRAINT portfolio_items_user_id_freelancer_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.freelancer_profiles(user_id) ON DELETE CASCADE;