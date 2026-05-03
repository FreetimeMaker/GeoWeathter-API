-- Create push_notifications table (bonus from fallback script)
CREATE TABLE IF NOT EXISTS public.push_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  message text NOT NULL,
  event_type varchar(100),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own notifications" ON public.push_notifications
  FOR ALL USING (auth.uid()::uuid = user_id)
  WITH CHECK (auth.uid()::uuid = user_id);

CREATE INDEX IF NOT EXISTS idx_push_notifications_user ON public.push_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_push_unread ON public.push_notifications(user_id) WHERE read_at IS NULL;

