-- ============================================================
-- Migration 005: Tambahan batas anggaran pada kategori
-- ============================================================

ALTER TABLE public.categories ADD COLUMN budget NUMERIC(15, 2);
