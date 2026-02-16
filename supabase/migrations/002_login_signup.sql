-- login_signup table (scope: Login/Signup; slash omitted in identifier for SQL)
CREATE TABLE IF NOT EXISTS login_signup (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE login_signup ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "login_signup_read_own" ON login_signup
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "login_signup_insert_own" ON login_signup
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "login_signup_update_own" ON login_signup
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "login_signup_delete_own" ON login_signup
  FOR DELETE USING (auth.uid() = user_id);
