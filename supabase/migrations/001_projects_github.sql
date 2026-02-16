-- projects_(github) table for Projects (GitHub) page
CREATE TABLE IF NOT EXISTS projects_(github) (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects_(github) ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "projects_(github)_read_own" ON projects_(github)
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "projects_(github)_insert_own" ON projects_(github)
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "projects_(github)_update_own" ON projects_(github)
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "projects_(github)_delete_own" ON projects_(github)
  FOR DELETE USING (auth.uid() = user_id);
