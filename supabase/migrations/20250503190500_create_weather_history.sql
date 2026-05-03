-- Create weather_history table
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
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.weather_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own weather_history" ON public.weather_history
  FOR ALL USING (auth.uid()::uuid = user_id)
  WITH CHECK (auth.uid()::uuid = user_id);

CREATE INDEX IF NOT EXISTS idx_weather_history_user_id ON public.weather_history(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_history_recorded ON public.weather_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_weather_history_user_recorded ON public.weather_history(user_id, recorded_at);

