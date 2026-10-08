-- ============================================================
-- Migration 007: Savings Goals (Fitur Tabungan)
-- ============================================================

-- Tabel Utama: Tujuan Tabungan
CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  target_date DATE,
  color TEXT,
  icon TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk mempercepat query per user
CREATE INDEX idx_savings_goals_user_id ON public.savings_goals(user_id);

-- Trigger updated_at
CREATE TRIGGER update_savings_goals_updated_at
BEFORE UPDATE ON public.savings_goals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Tipe Enum untuk transaksi tabungan
CREATE TYPE public.savings_transaction_type AS ENUM ('deposit', 'withdraw');

-- Tabel Transaksi Tabungan (Log Setor/Tarik)
CREATE TABLE public.savings_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.savings_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  type public.savings_transaction_type NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  expense_id UUID REFERENCES public.expenses(id) ON DELETE SET NULL, -- Tautan opsional ke Pengeluaran (Integrasi Opsi 2)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk performa histori transaksi per goal
CREATE INDEX idx_savings_transactions_goal_id ON public.savings_transactions(goal_id);
CREATE INDEX idx_savings_transactions_user_id ON public.savings_transactions(user_id);

-- ============================================================
-- Fungsi & Trigger: Otomatis Update Saldo (current_amount)
-- ============================================================
-- Fungsi ini secara otomatis menambah/mengurangi saldo `current_amount` di tabel `savings_goals` 
-- setiap kali terjadi transaksi (INSERT) di `savings_transactions`.

CREATE OR REPLACE FUNCTION update_goal_current_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'deposit' THEN
    UPDATE public.savings_goals
    SET current_amount = current_amount + NEW.amount
    WHERE id = NEW.goal_id;
  ELSIF NEW.type = 'withdraw' THEN
    UPDATE public.savings_goals
    SET current_amount = current_amount - NEW.amount
    WHERE id = NEW.goal_id;
  END IF;

  -- Cek jika sudah mencapai target
  UPDATE public.savings_goals
  SET is_completed = (current_amount >= target_amount)
  WHERE id = NEW.goal_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_savings_transaction_insert
AFTER INSERT ON public.savings_transactions
FOR EACH ROW
EXECUTE FUNCTION update_goal_current_amount();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_transactions ENABLE ROW LEVEL SECURITY;

-- Policy untuk savings_goals: User hanya bisa melihat dan memodifikasi miliknya sendiri
CREATE POLICY "Users can view their own savings goals"
ON public.savings_goals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings goals"
ON public.savings_goals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings goals"
ON public.savings_goals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings goals"
ON public.savings_goals FOR DELETE
USING (auth.uid() = user_id);

-- Policy untuk savings_transactions: User hanya bisa melihat dan memodifikasi miliknya sendiri
CREATE POLICY "Users can view their own savings transactions"
ON public.savings_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings transactions"
ON public.savings_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admin read-only access (Sesuai spesifikasi privasi aplikasi)
CREATE POLICY "Admins can view all savings goals"
ON public.savings_goals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can view all savings transactions"
ON public.savings_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
