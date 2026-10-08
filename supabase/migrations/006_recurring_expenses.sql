-- ============================================================
-- Migration 006: Recurring Expenses (Pengeluaran Berulang)
-- ============================================================

-- Tipe Enum untuk frekuensi
CREATE TYPE public.recurring_frequency AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- Tabel recurring_expenses
CREATE TABLE public.recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  frequency public.recurring_frequency NOT NULL DEFAULT 'monthly',
  next_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk mempercepat query harian
CREATE INDEX idx_recurring_expenses_user_id ON public.recurring_expenses(user_id);
CREATE INDEX idx_recurring_expenses_next_date ON public.recurring_expenses(next_date) WHERE is_active = true;

-- Trigger updated_at (asumsi function set_updated_at sudah ada dari migrasi lain, jika belum kita buat sederhana)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recurring_expenses_updated_at
BEFORE UPDATE ON public.recurring_expenses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Fungsi Otomatisasi (Dipanggil via pg_cron atau manual)
-- ============================================================
CREATE OR REPLACE FUNCTION public.process_recurring_expenses()
RETURNS void AS $$
DECLARE
  rec RECORD;
  new_date DATE;
BEGIN
  -- Loop melalui semua pengeluaran berulang yang aktif dan jatuh tempo
  FOR rec IN 
    SELECT * FROM public.recurring_expenses 
    WHERE is_active = true AND next_date <= CURRENT_DATE
  LOOP
    -- 1. Masukkan ke tabel expenses
    INSERT INTO public.expenses (user_id, category_id, amount, description, date)
    VALUES (
      rec.user_id, 
      rec.category_id, 
      rec.amount, 
      rec.description || ' (Otomatis)', 
      rec.next_date
    );

    -- 2. Hitung tanggal jatuh tempo berikutnya berdasarkan frekuensi
    IF rec.frequency = 'daily' THEN
      new_date := rec.next_date + INTERVAL '1 day';
    ELSIF rec.frequency = 'weekly' THEN
      new_date := rec.next_date + INTERVAL '1 week';
    ELSIF rec.frequency = 'monthly' THEN
      new_date := rec.next_date + INTERVAL '1 month';
    ELSIF rec.frequency = 'yearly' THEN
      new_date := rec.next_date + INTERVAL '1 year';
    END IF;

    -- Pastikan new_date lebih besar dari CURRENT_DATE jika ternyata telat berhari-hari
    -- (Catch-up mechanism sederhana: loncat ke jadwal mendatang terdekat)
    WHILE new_date <= CURRENT_DATE LOOP
      IF rec.frequency = 'daily' THEN
        new_date := new_date + INTERVAL '1 day';
      ELSIF rec.frequency = 'weekly' THEN
        new_date := new_date + INTERVAL '1 week';
      ELSIF rec.frequency = 'monthly' THEN
        new_date := new_date + INTERVAL '1 month';
      ELSIF rec.frequency = 'yearly' THEN
        new_date := new_date + INTERVAL '1 year';
      END IF;
    END LOOP;

    -- 3. Perbarui next_date di tabel recurring_expenses
    UPDATE public.recurring_expenses
    SET next_date = new_date
    WHERE id = rec.id;
    
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Catatan: Untuk mengaktifkan cron di Supabase (jika pg_cron diaktifkan):
-- SELECT cron.schedule('process_recurring', '0 0 * * *', 'SELECT public.process_recurring_expenses()');
