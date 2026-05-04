-- ============================================
-- FAVORITES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TRIGGER: updated_at auto-update
-- ============================================

CREATE OR REPLACE FUNCTION public.update_favorites_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_favorites_updated_at ON public.favorites;

CREATE TRIGGER trg_update_favorites_updated_at
BEFORE UPDATE ON public.favorites
FOR EACH ROW
EXECUTE FUNCTION public.update_favorites_updated_at();

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- SELECT: User sieht nur eigene Favoriten
CREATE POLICY "Users can view own favorites"
ON public.favorites
FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: User darf nur eigene Favoriten anlegen
CREATE POLICY "Users can insert own favorites"
ON public.favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: User darf nur eigene Favoriten ändern
CREATE POLICY "Users can update own favorites"
ON public.favorites
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: User darf nur eigene Favoriten löschen
CREATE POLICY "Users can delete own favorites"
ON public.favorites
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- INDEXE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_favorites_user_id
  ON public.favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_coords
  ON public.favorites(latitude, longitude);
