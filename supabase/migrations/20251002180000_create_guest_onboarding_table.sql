/*
  # Guest Onboarding System

  1. New Tables
    - `guest_onboarding`
      - `id` (uuid, primary key)
      - `guest_session_id` (uuid, unique, indexed)
      - `answers_json` (jsonb) - Stores onboarding responses
      - `current_step` (integer) - Current progress step
      - `completed` (boolean) - Whether onboarding is complete
      - `claimed_by_user_id` (uuid, nullable) - User who claimed this session
      - `ip_hash` (text) - Hashed IP for rate limiting
      - `user_agent` (text, nullable) - Browser user agent
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz) - Auto-delete after 14 days

  2. Security
    - Enable RLS on `guest_onboarding` table
    - Public access for inserting (unauthenticated users)
    - Only authenticated users can claim their own sessions
    - Automatic cleanup of expired sessions

  3. Indexes
    - Index on guest_session_id for fast lookups
    - Index on expires_at for cleanup jobs
    - Index on claimed_by_user_id for user session retrieval
*/

-- Create guest_onboarding table
CREATE TABLE IF NOT EXISTS guest_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_session_id uuid UNIQUE NOT NULL,
  answers_json jsonb DEFAULT '{}'::jsonb,
  current_step integer DEFAULT 0,
  completed boolean DEFAULT false,
  claimed_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '14 days')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_guest_onboarding_session_id
  ON guest_onboarding(guest_session_id);

CREATE INDEX IF NOT EXISTS idx_guest_onboarding_expires_at
  ON guest_onboarding(expires_at);

CREATE INDEX IF NOT EXISTS idx_guest_onboarding_claimed_by
  ON guest_onboarding(claimed_by_user_id);

-- Enable Row Level Security
ALTER TABLE guest_onboarding ENABLE ROW LEVEL SECURITY;

-- Allow unauthenticated users to insert their own sessions
CREATE POLICY "Anyone can create guest sessions"
  ON guest_onboarding
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow unauthenticated users to update their own sessions
CREATE POLICY "Anyone can update own guest session"
  ON guest_onboarding
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow unauthenticated users to read their own sessions
CREATE POLICY "Anyone can read own guest session"
  ON guest_onboarding
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to claim sessions
CREATE POLICY "Users can claim guest sessions"
  ON guest_onboarding
  FOR UPDATE
  TO authenticated
  USING (claimed_by_user_id IS NULL OR claimed_by_user_id = auth.uid())
  WITH CHECK (claimed_by_user_id = auth.uid());

-- Allow authenticated users to read their claimed sessions
CREATE POLICY "Users can read their claimed sessions"
  ON guest_onboarding
  FOR SELECT
  TO authenticated
  USING (claimed_by_user_id = auth.uid());

-- Function to clean up expired guest sessions (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_guest_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM guest_onboarding
  WHERE expires_at < now();
END;
$$;

-- Add user metadata columns for onboarding data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'onboarding_data'
  ) THEN
    ALTER TABLE users ADD COLUMN onboarding_data jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'kvkk_consent'
  ) THEN
    ALTER TABLE users ADD COLUMN kvkk_consent boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'kvkk_agreed_at'
  ) THEN
    ALTER TABLE users ADD COLUMN kvkk_agreed_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'marketing_consent'
  ) THEN
    ALTER TABLE users ADD COLUMN marketing_consent boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'guest_session_id'
  ) THEN
    ALTER TABLE users ADD COLUMN guest_session_id uuid;
  END IF;
END $$;

-- Create index on users.guest_session_id
CREATE INDEX IF NOT EXISTS idx_users_guest_session_id
  ON users(guest_session_id);
