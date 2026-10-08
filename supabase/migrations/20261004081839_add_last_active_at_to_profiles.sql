-- Add last_active_at to profiles
ALTER TABLE public.profiles ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE;
