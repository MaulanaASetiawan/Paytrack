-- ============================================================
-- Migration 002: Tabel categories (per-user)
-- ============================================================

CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  color       TEXT,
  icon        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT categories_user_name_unique UNIQUE (user_id, name)
);

CREATE INDEX idx_categories_user_id ON public.categories(user_id);
