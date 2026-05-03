-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tier varchar(50) NOT NULL,
  payment_method varchar(255),
  payment_type varchar(50) DEFAULT 'one_time',
  original_price decimal(10, 2),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_active boolean DEFAULT true
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users insert own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON public.subscriptions(is_active);

