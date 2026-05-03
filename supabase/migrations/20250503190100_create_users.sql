-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar(255) UNIQUE NOT NULL,
  password varchar(255),
  name varchar(255),
  subscription_tier varchar(50) DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy for users (self access)
CREATE POLICY "Users can view own data" ON public.users
  FOR ALL USING (true) -- Simplify for app-managed auth; tighten with JWT later
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

