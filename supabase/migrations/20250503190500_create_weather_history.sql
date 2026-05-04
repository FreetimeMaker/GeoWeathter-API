-- ============================================
-- WEATHER HISTORY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.weather_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  location varchar(255) NOT NULL,
  temperature decimal(5, 2),
  humidity decimal(5, 2),
  pressure decimal(7, 2),
  wind_speed decimal(5, 2),
  conditions varchar(255),
  sensor_data jsonb,
  recorded_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TRIGGER: updated_at auto-update
-- ============================================

CREATE OR REPLACE FUNCTION public.update_weather_history_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_weather_history_updated_at ON public.weather_history;

CREATE TRIGGER trg_update_weather_history_updated_at
BEFORE UPDATE ON public.weather_history
FOR EACH ROW
EXECUTE FUNCTION public.update_weather_history_updated_at();

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE public.weather_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- SELECT: User sieht nur eigene History
CREATE POLICY "Users can view own weather history"
ON public.weather_history
FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: User darf nur eigene History anlegen
CREATE POLICY "Users can insert own weather history"
ON public.weather_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: User darf nur eigene History ändern
CREATE POLICY "Users can update own weather history"
ON public.weather_history
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: User darf nur eigene History löschen
CREATE POLICY "Users can delete own weather history"
ON public.weather_history
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- INDEXE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_weather_history_user_id
  ON public.weather_history(user_id);

CREATE INDEX IF NOT EXISTS idx_weather_history_recorded
  ON public.weather_history(recorded_at);

CREATE INDEX IF NOT EXISTS idx_weather_history_user_recorded
  ON public.weather_history(user_id, recorded_at);
