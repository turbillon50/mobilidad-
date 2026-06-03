-- MIGRATION 002: Migrate to Clerk Authentication + Resend Notifications

ALTER TABLE users ADD COLUMN clerk_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN last_login TIMESTAMPTZ;

ALTER TABLE users RENAME COLUMN first_name TO name;
ALTER TABLE users DROP COLUMN last_name;
ALTER TABLE users RENAME COLUMN avatar_url TO image_url;

CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  channel VARCHAR(50) NOT NULL,
  type VARCHAR(100) NOT NULL,
  payload JSONB,
  status VARCHAR(50) NOT NULL,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);

ALTER TABLE drivers ADD COLUMN updated_at_clerk TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);
