-- ============================================================
-- Migration 004: Row Level Security Policies
-- ============================================================

-- Helper function: ambil role user yang sedang login
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ============================================================
-- RLS: profiles
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User hanya bisa membaca profilnya sendiri
CREATE POLICY "profiles: user can read own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- User hanya bisa mengupdate profilnya sendiri
CREATE POLICY "profiles: user can update own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin bisa membaca semua profil (read-only)
CREATE POLICY "profiles: admin can read all"
  ON public.profiles FOR SELECT
  USING (public.get_user_role() = 'admin');


-- ============================================================
-- RLS: categories
-- ============================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- User: CRUD penuh pada kategorinya sendiri
CREATE POLICY "categories: user can select own"
  ON public.categories FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "categories: user can insert own"
  ON public.categories FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "categories: user can update own"
  ON public.categories FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "categories: user can delete own"
  ON public.categories FOR DELETE
  USING (user_id = auth.uid());

-- Admin: read-only semua kategori
CREATE POLICY "categories: admin can read all"
  ON public.categories FOR SELECT
  USING (public.get_user_role() = 'admin');


-- ============================================================
-- RLS: expenses
-- ============================================================
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- User: CRUD penuh pada pengeluarannya sendiri
CREATE POLICY "expenses: user can select own"
  ON public.expenses FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "expenses: user can insert own"
  ON public.expenses FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "expenses: user can update own"
  ON public.expenses FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "expenses: user can delete own"
  ON public.expenses FOR DELETE
  USING (user_id = auth.uid());

-- Admin: read-only semua pengeluaran
CREATE POLICY "expenses: admin can read all"
  ON public.expenses FOR SELECT
  USING (public.get_user_role() = 'admin');
