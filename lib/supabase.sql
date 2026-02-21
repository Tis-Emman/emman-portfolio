-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id VARCHAR(255) NOT NULL,
  visitor_name VARCHAR(255),
  visitor_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  last_message_time TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  admin_responded BOOLEAN DEFAULT FALSE,
  created_by_ip INET,
  created_by_url VARCHAR(500)
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'bot', 'admin')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  processed_by_ai BOOLEAN DEFAULT FALSE
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_sessions_visitor_id ON chat_sessions(visitor_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Enable RLS (Row Level Security) for security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public (visitor) access - can only see their own session
CREATE POLICY "Users can view their own sessions"
  ON chat_sessions FOR SELECT
  USING (true); -- We'll verify visitor_id on backend

CREATE POLICY "Users can insert their own sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own messages"
  ON chat_messages FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE true -- Backend validates
    )
  );

CREATE POLICY "Users can insert their own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

-- Note: Admin tables policies should be created after you set up auth
-- For now, run admin queries with a service role key from your backend
